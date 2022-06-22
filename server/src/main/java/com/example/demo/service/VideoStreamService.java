package com.example.demo.service;

import com.example.demo.model.Document;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.validation.Valid;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.sql.SQLException;
import java.util.Objects;

@Service
public class VideoStreamService {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	public static final String CONTENT_TYPE = "Content-Type";
	public static final String CONTENT_LENGTH = "Content-Length";
	public static final String VIDEO_CONTENT = "video/";
	public static final String CONTENT_RANGE = "Content-Range";
	public static final String ACCEPT_RANGES = "Accept-Ranges";
	public static final String BYTES = "bytes";
	public static final int BYTE_RANGE = 1024;

	private final DocumentService imageService;

	@Autowired
	public VideoStreamService(final DocumentService imageService) {
		this.imageService = imageService;
	}

	public ResponseEntity<byte[]> prepareContent(Long id, String fileType, String range) throws SQLException {

		long rangeStart = 0;
		long rangeEnd;
		byte[] data;
		Long fileSize;

		try {
			fileSize = getFileSize(id);
			if (range == null) {
				return ResponseEntity.status(HttpStatus.OK).header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
						.header(CONTENT_LENGTH, String.valueOf(fileSize))
						.body(readByteRange(id, rangeStart, fileSize - 1)); // Read the object and convert it as bytes
			}
			String[] ranges = range.split("-");
			rangeStart = Long.parseLong(ranges[0].substring(6));
			if (ranges.length > 1) {
				rangeEnd = Long.parseLong(ranges[1]);
			}
			else {
				rangeEnd = fileSize - 1;
			}
			if (fileSize < rangeEnd) {
				rangeEnd = fileSize - 1;
			}
			data = readByteRange(id, rangeStart, rangeEnd);
		} catch (IOException e) {
			logger.error("Exception while reading the file {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		String contentLength = String.valueOf((rangeEnd - rangeStart) + 1);
		return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).header(CONTENT_TYPE, VIDEO_CONTENT + fileType)
				.header(ACCEPT_RANGES, BYTES).header(CONTENT_LENGTH, contentLength)
				.header(CONTENT_RANGE, BYTES + " " + rangeStart + "-" + rangeEnd + "/" + fileSize).body(data);

	}

	public byte[] readByteRange(Long id, long start, long end) throws IOException, SQLException {

		byte[] fileData = getBytesDataFromFileId(id);
		try (InputStream inputStream = (new ByteArrayInputStream(fileData));
			 ByteArrayOutputStream bufferedOutputStream = new ByteArrayOutputStream()) {
			byte[] data = new byte[BYTE_RANGE];
			int nRead;
			while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
				bufferedOutputStream.write(data, 0, nRead);
			}
			bufferedOutputStream.flush();
			byte[] result = new byte[(int) (end - start) + 1];
			System.arraycopy(bufferedOutputStream.toByteArray(), (int) start, result, 0, result.length);
			return result;
		}
	}

	public Long getFileSize(Long id) throws SQLException {
		return (long) getBytesDataFromFileId(id).length;
	}

	private byte[] getBytesDataFromFileId(final Long id) throws SQLException {
		final Document document = imageService.getDocumentById(id);
		return document.getContents().getBytes(1, (int) document.getContents().length());
	}

	private File writeByteToFile(final String path, final byte[] bytes) {
		File file = new File(path);
		try {

			// Initialize a pointer
			// in file using OutputStream
			OutputStream os = new FileOutputStream(file);

			// Starts writing the bytes in it
			os.write(bytes);
			System.out.println("Successfully"
					+ " byte inserted");

			// Close the file
			os.close();
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
		return file;
	}

	public void extract(final Long id, final int nrFrames, @Valid boolean allFrames)
			throws SQLException {
		String name = imageService.getDocumentById(id).getName();
		if (nrFrames < 1 && !allFrames ) {
			throw new RuntimeException("not a valid number of frames or not all frames");
		}
		final byte[] bytes = getBytesDataFromFileId(id);
		final File myObj = writeByteToFile("video.mp4", bytes);
		final FFmpegFrameGrabber frameGrabber = new FFmpegFrameGrabber(myObj.getAbsoluteFile());
		frameGrabber.setAudioChannels(0);
		try {
			frameGrabber.start();
			final int videoFramesNr = frameGrabber.getLengthInVideoFrames();
			final int framesNr = frameGrabber.getLengthInFrames();
			System.out.println(
					"Video has " + frameGrabber.getFrameRate() + " frame rate and " +
							videoFramesNr + " number of video frames and " +
							framesNr + " frames");
			if (!allFrames){
				if (nrFrames > videoFramesNr) {
					throw new RuntimeException("over a valid number of frames");
				}
				final int step = (videoFramesNr / nrFrames) - 1;
				Java2DFrameConverter c = new Java2DFrameConverter();
				System.out.println("Step is " + step);
				for (int i = step; i <= framesNr; i = i + step) {
					frameGrabber.setFrameNumber(i);
					Frame f = frameGrabber.grabImage();
					BufferedImage bi = c.convert(f);
					if (Objects.nonNull(bi)) {
						File file = new File("img" + i + ".png");
						ImageIO.write(bi, "png", file);
						imageService.saveImageFromVideo(file, name);
						Files.delete(file.toPath());
						System.out.println("delete from disk and write to database " + file.getName());
					}
					c.close();
				}
				frameGrabber.flush();
				frameGrabber.stop();
				Files.delete(myObj.toPath());
				System.out.println("extraction finished");
			}
			else {
				final int step = 1;
				Java2DFrameConverter c = new Java2DFrameConverter();
				System.out.println("Step is " + step);
				for (int i = 1; i <= framesNr; i = i + step) {
					frameGrabber.setFrameNumber(i);
					Frame f = frameGrabber.grabImage();
					BufferedImage bi = c.convert(f);
					if (Objects.nonNull(bi)) {
						File file = new File("img" + i + ".png");
						ImageIO.write(bi, "png", file);
						imageService.saveImageFromVideo(file, name);
						Files.delete(file.toPath());
						System.out.println("delete from disk and write to database " + file.getName());
					}
					c.close();
				}
				frameGrabber.flush();
				frameGrabber.stop();
				Files.delete(myObj.toPath());
				System.out.println("extraction finished");
			}
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
}

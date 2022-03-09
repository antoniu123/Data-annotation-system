package com.example.demo.parser;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import org.springframework.stereotype.Component;

@Component
public class CsvParser {

    public <T> List<T> parseList(final InputStream inputStream, final Class<T> clazz, final char separator)
            throws IOException {

        final CsvMapper mapper = new CsvMapper();
        final CsvSchema schema = mapper.schemaFor(clazz)
                .withHeader()
                .withColumnSeparator(separator);

        final MappingIterator<T> objectReader = mapper.readerFor(clazz)
                .with(schema)
                .readValues(inputStream);

        return objectReader.readAll();
    }

}

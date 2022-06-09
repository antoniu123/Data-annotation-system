package com.example.demo.service;

import com.example.demo.model.ApplicationUser;
import com.example.demo.model.VDocDetail;
import com.example.demo.model.VTagStatus;
import com.example.demo.model.VTagsOccurences;
import com.example.demo.model.VTotalCompletedPercent;
import com.example.demo.model.VUserTypeCount;
import com.example.demo.repository.ApplicationUserRepository;
import com.example.demo.repository.VDocDetailRepository;
import com.example.demo.repository.VTagStatusRepository;
import com.example.demo.repository.VTagsOccurencesRepository;
import com.example.demo.repository.VTotalCompletedPercentRepository;
import com.example.demo.repository.VUserTypeCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GraphicService {

        private final ApplicationUserRepository applicationUserRepository;

        private final VDocDetailRepository vDocDetailRepository;

        private final VUserTypeCountRepository vUserTypeCountRepository;

        private final VTotalCompletedPercentRepository vTotalCompletedPercentRepository;

        private final VTagsOccurencesRepository vTagsOccurencesRepository;

        private final VTagStatusRepository vTagStatusRepository;

        @Autowired
        public GraphicService(final ApplicationUserRepository applicationUserRepository,
                              final VDocDetailRepository vDocDetailRepository, final VUserTypeCountRepository vUserTypeCountRepository,
                              final VTotalCompletedPercentRepository vTotalCompletedPercentRepository, final VTagsOccurencesRepository vTagsOccurencesRepository,
                              final VTagStatusRepository vTagStatusRepository) {
                this.applicationUserRepository = applicationUserRepository;
                this.vDocDetailRepository = vDocDetailRepository;
                this.vUserTypeCountRepository = vUserTypeCountRepository;
                this.vTotalCompletedPercentRepository = vTotalCompletedPercentRepository;
                this.vTagsOccurencesRepository = vTagsOccurencesRepository;
                this.vTagStatusRepository = vTagStatusRepository;
        }

        public List<VDocDetail> getDocDetailsPerUser(){
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                String username;
                if (principal instanceof UserDetails) {
                        username = ((UserDetails) principal).getUsername();
                } else {
                        username = principal.toString();
                }
                final ApplicationUser applicationUser = applicationUserRepository.findByUsername(username)
                        .orElseGet(ApplicationUser::new);

                return vDocDetailRepository.findAllByOwner(applicationUser);
        }

        public List<VUserTypeCount> getPercentsByRoleName(){
                return vUserTypeCountRepository.findAll();
        }

        public List<VTotalCompletedPercent> getCompletedPercentPerUser(){
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                String username;
                if (principal instanceof UserDetails) {
                        username = ((UserDetails) principal).getUsername();
                } else {
                        username = principal.toString();
                }
                final ApplicationUser applicationUser = applicationUserRepository.findByUsername(username)
                        .orElseGet(ApplicationUser::new);

                return vTotalCompletedPercentRepository.findAllByOwnerId(applicationUser.getId());
        }

        public List<VTagsOccurences> getNumberOfOccurencesByTagName(){
                return vTagsOccurencesRepository.findAll();
        }

        public List<VTagStatus> getNumberOfTagsPerStatus(){
                return vTagStatusRepository.findAll();
        }
}

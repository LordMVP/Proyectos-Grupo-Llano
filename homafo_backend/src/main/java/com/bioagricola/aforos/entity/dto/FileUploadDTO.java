package com.bioagricola.aforos.entity.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FileUploadDTO {

	private List<MultipartFile> files;
   
}

package org.springframework.web.multipart;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.core.io.InputStreamSource;

public interface MultipartFile extends InputStreamSource {

  public String getName();

  public String getOriginalFilename();

  public String getContentType();

  public boolean isEmpty();

  public long getSize();

  public byte[] getBytes()
          throws IOException;

  @Override
  public InputStream getInputStream()
          throws IOException;

  public void transferTo(File file)
          throws IOException, IllegalStateException;
}

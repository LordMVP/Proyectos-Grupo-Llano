FROM tomcat:8.5-jdk8-corretto
ENV SPRING_PROFILES_ACTIVE=dev
COPY bioagricola-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps
CMD ["catalina.sh", "run"]
FROM maven:3.8.4-amazoncorretto-8 AS build
LABEL MAINTAINER="michaelrojas@progracol.com"
WORKDIR /usr/src/app
COPY . /usr/src/app
# Compile and package the application to an executable JAR
RUN mvn install:install-file -Dfile=/usr/src/app/bioagricola-servicios/EstandarGell-1.0-SNAPSHOT.jar
RUN mvn clean install

FROM tomcat:8.5-jdk8-corretto
COPY --from=build /usr/src/app/bioagricola-servicios/target/bioagricola-servicios.war /usr/local/tomcat/webapps
CMD ["catalina.sh", "run"]

#FROM openjdk:8-jdk-alpine
#COPY --from=build /usr/src/app/target/pointer-0.0.1-SNAPSHOT.jar /usr/app/api.jar
#ENTRYPOINT ["java","-jar","/usr/app/api.jar"]
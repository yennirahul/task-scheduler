FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY coordinator/pom.xml coordinator/pom.xml
COPY worker/pom.xml worker/pom.xml

COPY coordinator/src coordinator/src
COPY worker/src worker/src

RUN mvn -pl coordinator -am clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/coordinator/target/coordinator-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

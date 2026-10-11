
# Stage 1: Build the Spring Boot application
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY backend/pom.xml backend/pom.xml
COPY backend/proto/pom.xml backend/proto/pom.xml
COPY backend/coordinator/pom.xml backend/coordinator/pom.xml
COPY backend/worker/pom.xml backend/worker/pom.xml
COPY backend/proto/src/ backend/proto/src/
COPY backend/coordinator/src/ backend/coordinator/src/

WORKDIR /app/backend
RUN mvn -pl coordinator -am clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/backend/coordinator/target/*.jar app.jar

EXPOSE 8080 9090

ENTRYPOINT ["java", "-jar", "app.jar"]

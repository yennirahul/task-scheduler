FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY backend/pom.xml backend/pom.xml
COPY backend/proto/pom.xml backend/proto/pom.xml
COPY backend/coordinator/pom.xml backend/coordinator/pom.xml
COPY backend/worker/pom.xml backend/worker/pom.xml
COPY backend/proto/src/ backend/proto/src/
COPY backend/worker/src/ backend/worker/src/

WORKDIR /app/backend
RUN mvn -pl worker -am clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/worker/target/*.jar app.jar
EXPOSE 9091
ENTRYPOINT ["java", "-jar", "app.jar"]

# Multi-stage build for Java 21 Spring Boot Application
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Install dos2unix to ensure linux line-endings for mvnw
RUN apk add --no-cache dos2unix

COPY . .
RUN dos2unix ./mvnw && chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/management-system-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

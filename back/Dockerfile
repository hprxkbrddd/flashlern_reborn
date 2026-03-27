# syntax=docker/dockerfile:1

############################################
# Stage 1 — dependencies
############################################
FROM eclipse-temurin:21-jdk-jammy AS deps

WORKDIR /build

COPY --chmod=0755 mvnw mvnw
COPY .mvn/ .mvn/
COPY pom.xml pom.xml

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw dependency:go-offline -DskipTests

############################################
# Stage 2 — package
############################################
FROM deps AS package

COPY src src/

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw package -DskipTests && \
    mv target/*.jar target/app.jar

############################################
# Stage 3 — runtime
############################################
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN adduser --disabled-password --gecos "" appuser
USER appuser

COPY --from=package /build/target/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

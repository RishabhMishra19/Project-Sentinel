# ============================================================
# Stage 1: Build sentinel-common
# ============================================================

FROM maven:3.9-amazoncorretto-21 AS common-build

WORKDIR /app

# Copy POM first.
# This layer can be cached if the POM doesn't change.
COPY backend/sentinel-common/pom.xml ./sentinel-common/pom.xml

# Download common dependencies, Reuse Maven dependencies from the persistent BuildKit cache
RUN --mount=type=cache,id=maven-cache,target=/root/.m2 mvn -f sentinel-common/pom.xml dependency:go-offline
# Copy source separately.
# This changes more frequently than the POM.
COPY backend/sentinel-common/src ./sentinel-common/src

# Build and install common into Maven's local repository.
RUN --mount=type=cache,id=maven-cache,target=/root/.m2 mvn -f sentinel-common/pom.xml install -DskipTests


# ============================================================
# Stage 2: Build sentinel-processor
# ============================================================

FROM maven:3.9-amazoncorretto-21 AS processor-build

WORKDIR /app

# Copy PROCESSOR POM first for better Docker caching.
COPY backend/sentinel-processor/pom.xml ./sentinel-processor/pom.xml

# Download PROCESSOR dependencies.
RUN --mount=type=cache,id=maven-cache,target=/root/.m2 mvn -f sentinel-processor/pom.xml dependency:go-offline
# Copy PROCESSOR source.
COPY backend/sentinel-processor/src ./sentinel-processor/src

# Build the Spring Boot JAR.
RUN --mount=type=cache,id=maven-cache,target=/root/.m2 mvn -f sentinel-processor/pom.xml package -DskipTests


# ============================================================
# Stage 3: Runtime
# ============================================================

FROM amazoncorretto:21

WORKDIR /app

# Copy ONLY the built PROCESSOR JAR.
# Maven, source code and build files are not included.
COPY --from=processor-build /app/sentinel-processor/target/*.jar app.jar

EXPOSE 8080

# Start Spring Boot instead of Maven.
ENTRYPOINT ["java", "-jar", "app.jar"]
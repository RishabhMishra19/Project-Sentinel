# ============================================================
# Stage 1: Build sentinel-api & Sentinel-common
# ============================================================

FROM maven:3.9-amazoncorretto-21 AS api-build

WORKDIR /app

# Copy module POMs first for better caching
# Root Maven reactor POM
COPY backend/pom.xml .

# Module POMs
COPY backend/sentinel-common/pom.xml ./sentinel-common/pom.xml
COPY backend/sentinel-api/pom.xml ./sentinel-api/pom.xml
COPY backend/sentinel-ingest/pom.xml ./sentinel-ingest/pom.xml
COPY backend/sentinel-processor/pom.xml ./sentinel-processor/pom.xml

# Copy source separately.
# This changes more frequently than the POM.
COPY backend/sentinel-common/src ./sentinel-common/src
COPY backend/sentinel-api/src ./sentinel-api/src

# Build ONLY:
#   sentinel-common
#   sentinel-api
#
# NOT ingest or processor.
RUN --mount=type=cache,id=maven-cache,target=/root/.m2 mvn -f pom.xml -pl sentinel-api -am package -DskipTests

# ============================================================
# Stage 2: Runtime
# ============================================================

FROM amazoncorretto:21

WORKDIR /app

# Copy ONLY the built API JAR.
# Maven, source code and build files are not included.
COPY --from=api-build /app/sentinel-api/target/*.jar app.jar

EXPOSE 8080

# Start Spring Boot instead of Maven.
ENTRYPOINT ["java", "-jar", "app.jar"]
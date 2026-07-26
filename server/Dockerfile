FROM maven:3.9-amazoncorretto-21 AS build
WORKDIR /app

COPY pom.xml .
COPY common ./common
COPY server ./server
COPY ingest ./ingest
COPY worker ./worker

RUN mvn -pl server -am -B -q package -DskipTests \
    && cp server/target/server-0.0.1-SNAPSHOT.jar /app/app.jar

FROM amazoncorretto:21
WORKDIR /app

RUN yum install -y curl && yum clean all

COPY --from=build /app/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Pull base system
FROM debian:buster
USER root

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
ENV GEOSERVER_HOME=/usr/share/geoserver
ENV GEOSERVER_DATA_DIR=/usr/share/geoserver/data_dir

# Install utilities
RUN apt-get update
RUN apt-get install -y locales curl unzip openjdk-11-jre-headless

# Install locale
RUN sed -i -e 's/# \(en_US\.UTF-8 .*\)/\1/' /etc/locale.gen && locale-gen

# Install GeoServer and CSS plugin
WORKDIR /usr/share/geoserver
RUN curl -L -o geoserver.zip https://sourceforge.net/projects/geoserver/files/GeoServer/2.18.0/geoserver-2.18.0-bin.zip
RUN unzip -q geoserver.zip && rm geoserver.zip
WORKDIR /usr/share/geoserver/webapps/geoserver/WEB-INF/lib
RUN curl -o css-plugin.zip https://build.geoserver.org/geoserver/2.18.x/ext-latest/geoserver-2.18-SNAPSHOT-css-plugin.zip
RUN unzip -q css-plugin.zip && rm css-plugin.zip

# Install GRASS GIS
RUN apt-get install -y grass-core

# Install Enscript/Ghostscript
RUN apt-get install -y enscript ghostscript

# Install Node.js
RUN curl -L https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Clean up
RUN apt-get clean

# Install webapp
WORKDIR /oct
RUN mkdir -p data_from_browser
COPY webapp/package*.json ./webapp/
RUN cd webapp && npm ci
COPY webapp webapp

COPY run.sh ./

# Start scripts
CMD [ "bash", "run.sh" ]
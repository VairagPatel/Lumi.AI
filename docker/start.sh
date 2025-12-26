#!/bin/bash

# Start nginx in background
nginx &

# Start Spring Boot application
java -jar app.jar
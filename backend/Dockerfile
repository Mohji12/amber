# Multi-stage build for optimized AWS Lambda image
FROM public.ecr.aws/lambda/python:3.11 AS builder

# Set working directory
WORKDIR /var/task

# Copy requirements first for better Docker layer caching
COPY requirements-lambda.txt .

# Install Python dependencies with optimizations
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --compile -r requirements-lambda.txt

# Copy application code
COPY . .

# Production stage
FROM public.ecr.aws/lambda/python:3.11

# Set working directory
WORKDIR /var/task

# Copy Python packages from builder stage
COPY --from=builder /var/task /var/task
COPY --from=builder /var/lang/lib/python3.11/site-packages /var/lang/lib/python3.11/site-packages

# Set environment variables for performance
ENV PYTHONPATH=/var/task
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONHASHSEED=random

# Create directory for logs and ensure proper permissions
RUN mkdir -p /var/task/logs

# Expose port (for local testing)
EXPOSE 8000

# Health check with faster response
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/ready || exit 1

# Command to run the application
# For Lambda: handler is the Mangum handler
# For local testing: uvicorn server
CMD ["app.main.handler"]
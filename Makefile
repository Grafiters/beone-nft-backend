# Define variables
TYPEORM_CMD = npx ts-node ./node_modules/typeorm/cli.js
TYPEORM_CONFIG = -d src/configs/typeorm.config.ts

# Default target
all: help

# Help target to display available commands
help:
	@echo "Usage:"
	@echo "  make generate-migration NAME=\"migration-name\"  Generate a new migration"
	@echo "  make run-migrations                          Run all pending migrations"

# Generate a new migration
generate-migration:
ifeq ($(NAME),)
	@echo "Error: You must specify the NAME of the migration"
	@echo "Usage: make generate-migration NAME=\"migration-name\""
else
	$(TYPEORM_CMD) migration:generate $(TYPEORM_CONFIG) -n $(NAME)
endif

# Run all pending migrations
run-migrations:
	$(TYPEORM_CMD) migration:run $(TYPEORM_CONFIG)

# Clean up generated files (optional)
clean:
	rm -rf dist
	rm -rf node_modules/.cache

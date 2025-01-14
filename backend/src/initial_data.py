import logging

from sqlmodel import Session

from src.core.db import engine, init_db, update_permissions, create_first_superuser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    init_db()

    with Session(engine) as session:
        create_first_superuser(session)
        update_permissions(session)


def main() -> None:
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()

import edgedb
from backend.core.config import get_settings

settings = get_settings()

# Initialize EdgeDB client
client = edgedb.create_client(settings.EDGEDB_DSN)

async def create_tables():
    # Create necessary tables in EdgeDB
    await client.query("""
        module default {
            # Define User model
            type User {
                required property username -> str {
                    constraint exclusive
                }
                required property email -> str {
                    constraint exclusive
                }
                property password -> str;
                multi link consultations -> Consultation;
            }

            # Define Consultation model
            type Consultation {
                required property title -> str;
                required property description -> str;
                required property created_at -> datetime {
                    default := <datetime>now()
                }
                link user -> User;
            }

            # Define Chat model
            type Chat {
                required property message -> str;
                required property sent_at -> datetime {
                    default := <datetime>now()
                }
                link consultation -> Consultation;
                link user -> User;
            }
        }
    """)

async def drop_tables():
    # Drop tables if needed
    await client.query("""
        module default {
            drop type User;
            drop type Consultation;
            drop type Chat;
        }
    """)
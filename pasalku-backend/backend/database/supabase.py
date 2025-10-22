from supabase import create_client, Client
from backend.core.config import get_settings

settings = get_settings()

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def get_supabase_client() -> Client:
    return supabase

async def create_table_if_not_exists():
    # Example logic to create a table if it does not exist
    # This should be customized based on your specific table structure and requirements
    table_name = "your_table_name"
    existing_tables = await supabase.table("information_schema.tables").select("table_name").eq("table_name", table_name).execute()

    if not existing_tables.data:
        await supabase.table(table_name).create({
            "column1": "data_type",
            "column2": "data_type",
            # Add more columns as needed
        }).execute()
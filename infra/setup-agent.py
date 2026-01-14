"""
Azure AI Foundry - Agent Setup Script (New Foundry)
=====================================================
Creates the GNO Planner agent with function tools using the new Foundry SDK.
Automatically cleans up any existing agent with the same name before creating.

Prerequisites:
  - pip install -r requirements.txt
  - az login (for DefaultAzureCredential)
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition, FunctionTool

# Load environment variables from infra/.env
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# =============================================================================
# Configuration
# =============================================================================

PROJECT_ENDPOINT = os.environ.get("PROJECT_ENDPOINT")
MODEL_DEPLOYMENT_NAME = os.environ.get("MODEL_DEPLOYMENT_NAME", "gpt-4o")
AGENT_NAME = os.environ.get("AGENT_NAME", "GNOPlanner")

if not PROJECT_ENDPOINT:
    raise ValueError("PROJECT_ENDPOINT not set. Run setup.ps1 first.")

# =============================================================================
# Tool Definitions
# =============================================================================

TOOLS = [
    FunctionTool(
        name="search_restaurants",
        description="Search for restaurants in a location. Use this to find dinner options. Returns real venues with ratings, prices, and links.",
        parameters={
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and neighborhood or area, e.g., 'Dallas, TX' or 'Deep Ellum' or 'Uptown Dallas'"
                },
                "cuisine": {
                    "type": "string",
                    "description": "Type of cuisine, e.g., 'Italian', 'Mexican', 'Japanese', 'American'. Leave empty for all types."
                },
                "price_level": {
                    "type": "integer",
                    "description": "Price level from 1 (cheap/casual) to 4 (expensive/upscale). Omit to search all price ranges."
                },
                "party_size": {
                    "type": "integer",
                    "description": "Number of people in the group. Important for checking if venue can accommodate."
                },
                "vibes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Desired atmosphere keywords, e.g., ['trendy', 'romantic', 'lively', 'casual', 'upscale', 'cozy', 'instagrammable']"
                }
            },
            "required": ["location", "party_size"],
            "additionalProperties": False
        },
        strict=False
    ),
    FunctionTool(
        name="search_bars",
        description="Search for bars, lounges, and nightlife spots. Use this for post-dinner drinks or late-night venues.",
        parameters={
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and neighborhood or area"
                },
                "vibes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Type of bar atmosphere: 'cocktail bar', 'wine bar', 'rooftop', 'speakeasy', 'dive bar', 'dance club', 'lounge', 'sports bar', 'live music'"
                },
                "price_level": {
                    "type": "integer",
                    "description": "Price level from 1 to 4"
                },
                "open_late": {
                    "type": "boolean",
                    "description": "If true, only return venues that are open past midnight"
                }
            },
            "required": ["location"],
            "additionalProperties": False
        },
        strict=False
    ),
    FunctionTool(
        name="search_events",
        description="Search for events, concerts, comedy shows, or activities happening on a specific date. Good for adding something special to the night.",
        parameters={
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City to search for events"
                },
                "date": {
                    "type": "string",
                    "description": "Date to search in YYYY-MM-DD format"
                },
                "categories": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Event types to search: 'concert', 'comedy', 'art', 'food festival', 'live music', 'theater', 'dance', 'networking'"
                },
                "max_price": {
                    "type": "number",
                    "description": "Maximum ticket price per person in dollars"
                }
            },
            "required": ["location", "date"],
            "additionalProperties": False
        },
        strict=False
    ),
    FunctionTool(
        name="get_rideshare_estimate",
        description="Get price and time estimates for Uber/Lyft between two locations. Returns cost range and links to book rides.",
        parameters={
            "type": "object",
            "properties": {
                "pickup_address": {
                    "type": "string",
                    "description": "Starting address or venue name with city, e.g., 'Uchi Dallas, TX' or '2817 Maple Ave, Dallas, TX'"
                },
                "dropoff_address": {
                    "type": "string",
                    "description": "Destination address or venue name with city"
                },
                "passenger_count": {
                    "type": "integer",
                    "description": "Number of passengers. If more than 4, will suggest XL/Plus options."
                }
            },
            "required": ["pickup_address", "dropoff_address"],
            "additionalProperties": False
        },
        strict=False
    ),
    FunctionTool(
        name="get_directions",
        description="Get travel time and distance between two locations. Use this to calculate realistic timing for the itinerary.",
        parameters={
            "type": "object",
            "properties": {
                "origin": {
                    "type": "string",
                    "description": "Starting address or place name"
                },
                "destination": {
                    "type": "string",
                    "description": "Ending address or place name"
                },
                "mode": {
                    "type": "string",
                    "enum": ["walking", "driving", "transit"],
                    "description": "How they're getting there. Use 'driving' for rideshare time estimates."
                }
            },
            "required": ["origin", "destination", "mode"],
            "additionalProperties": False
        },
        strict=False
    ),
    FunctionTool(
        name="check_availability",
        description="Check if a restaurant has availability for a reservation at a specific time. Always use this before suggesting a reservation time.",
        parameters={
            "type": "object",
            "properties": {
                "venue_id": {
                    "type": "string",
                    "description": "The venue ID returned from search_restaurants results"
                },
                "venue_name": {
                    "type": "string",
                    "description": "Human-readable name of the venue for reference"
                },
                "date": {
                    "type": "string",
                    "description": "Reservation date in YYYY-MM-DD format"
                },
                "time": {
                    "type": "string",
                    "description": "Desired reservation time in HH:MM format (24-hour), e.g., '19:00' for 7 PM"
                },
                "party_size": {
                    "type": "integer",
                    "description": "Number of guests for the reservation"
                }
            },
            "required": ["venue_id", "venue_name", "date", "time", "party_size"],
            "additionalProperties": False
        },
        strict=False
    )
]

# =============================================================================
# Main Setup
# =============================================================================

def load_system_prompt() -> str:
    """Load the system prompt from the markdown file."""
    prompt_path = Path(__file__).parent / "gno-system-prompt.md"
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


def delete_existing_agents(project_client: AIProjectClient, agent_name: str) -> None:
    """Delete any existing agents with the given name prefix."""
    print(f"  Checking for existing '{agent_name}' agents to clean up...")
    deleted_count = 0
    
    for agent in project_client.agents.list():
        if agent.name and (agent.name == agent_name or agent.name.startswith(agent_name)):
            print(f"    Deleting existing agent: {agent.name} ({agent.id})")
            project_client.agents.delete(agent.id)
            deleted_count += 1
    
    if deleted_count > 0:
        print(f"  ✓ Deleted {deleted_count} existing agent(s)")
    else:
        print("  ✓ No existing agents to clean up")


def main():
    print("=" * 60)
    print("  Azure AI Foundry - Agent Setup (New Foundry)")
    print("=" * 60)
    print()
    
    print(f"Project Endpoint: {PROJECT_ENDPOINT}")
    print(f"Model: {MODEL_DEPLOYMENT_NAME}")
    print(f"Agent Name: {AGENT_NAME}")
    print()
    
    # Load system prompt
    print("[1/4] Loading system prompt...")
    instructions = load_system_prompt()
    print(f"  ✓ Loaded {len(instructions)} characters")
    
    # Create client
    print("[2/4] Connecting to Azure AI Foundry (new Foundry)...")
    credential = DefaultAzureCredential()
    project_client = AIProjectClient(
        endpoint=PROJECT_ENDPOINT,
        credential=credential
    )
    print("  ✓ Connected")
    
    # Delete existing agents with same name
    print("[3/4] Cleaning up existing agents...")
    delete_existing_agents(project_client, AGENT_NAME)
    
    # Create agent using new Foundry API
    print("[4/4] Creating agent...")
    
    agent = project_client.agents.create(
        name=AGENT_NAME,
        definition=PromptAgentDefinition(
            model=MODEL_DEPLOYMENT_NAME,
            instructions=instructions,
            tools=TOOLS
        ),
        description="Girls Night Out planning assistant - helps groups plan perfect nights out in Dallas"
    )
    
    print(f"  ✓ Agent created!")
    print()
    print("=" * 60)
    print("  Agent Details")
    print("=" * 60)
    print(f"  ID: {agent.id}")
    print(f"  Name: {agent.name}")
    print()
    
    # Update .env with agent info
    env_path = Path(__file__).parent / ".env"
    
    # Read existing content and remove old AGENT_ID if present
    existing_content = ""
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            # Filter out old AGENT_ID lines
            lines = [l for l in lines if not l.startswith("AGENT_ID=") and "Agent created by setup-agent.py" not in l]
            existing_content = "".join(lines).rstrip()
    
    with open(env_path, "w", encoding="utf-8") as f:
        f.write(existing_content)
        f.write(f"\n\n# Agent created by setup-agent.py (new Foundry)\n")
        f.write(f"AGENT_ID={agent.id}\n")
    
    print("✓ Updated .env with AGENT_ID")
    print()
    print("Next steps:")
    print("  1. Test the agent in Azure AI Foundry portal")
    print("  2. Deploy Azure Functions: cd apps/tools && func azure functionapp publish <app-name>")
    print("  3. Start the API: cd apps/api && pnpm dev")
    print()


if __name__ == "__main__":
    main()

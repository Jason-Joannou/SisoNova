from fastmcp import FastMCP

mcp = FastMCP("Basic Greeting tool")


@mcp.tool
def greeting_message(name: str) -> str:
    "Greeting message if name is provided"
    return f"Hello {name}, ITS AWESOME TO MEET YOU!!!"
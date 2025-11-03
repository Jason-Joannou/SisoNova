from fastmcp import FastMCP
from api.tools.central_knowledge_graph.models import ComplianceNode, RegulationNode
import json

mcp = FastMCP(
    name="Central Knowledge Graph Service",
    instructions="The purpose of this mcp server is to provide central knowledge graph support")

@mcp.tool(name="add_compliance_node",
          description="Add a new compliance node to the central knowledge graph",)
async def add_compliance_node(compliance_node: ComplianceNode):
    print(json.dumps(compliance_node.model_dump(), indent=2))
    return "success"

@mcp.tool(name="add_regulation_node",
          description="Add a new regulation node to the central knowledge graph",)
async def add_regulation_node(regulation_node: RegulationNode):
    print(json.dumps(regulation_node.model_dump(), indent=2))
    return "success"
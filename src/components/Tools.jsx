import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTools, deleteTool, updateTool } from "../api/tools_api";

export function Tools() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["tools"],
    queryFn: getTools,
    select: (data) => data.sort((a, b) => b.id - a.id),
  });

  const toolDelete = useMutation({
    mutationFn: deleteTool,
    onSuccess: () => {
      queryClient.invalidateQueries("tools");
    },
  });

  const toolUpdate = useMutation({
    mutationFn: updateTool,
    onSuccess: () => {
      queryClient.invalidateQueries("tools")
    },
  });
  if (query.isLoading) return <h2>loading...</h2>;
  else if (query.isError) return <h2>{query.error.message}</h2>;

  return (
    <div>
      {query.data.map((tool) => (
        <div key={tool.id}>
          <h3>{tool.name}</h3>
          <p> {tool.description} </p>
          <p>{tool.price}</p>
          <button
            onClick={() => {
              toolDelete.mutate(tool.id);
            }}
          >
            delete
          </button>
          <input
            type="checkbox"
            checked={tool.state}
            id={tool.id}
            onChange={(e) => {
              toolUpdate.mutate({
                ...tool,
                state: e.target.checked,
              });
            }}
          />
          <label htmlFor={tool.id}>Done</label>
        </div>
      ))}
    </div>
  );
}

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";


const GET_TODOS = gql`
  query GetTodos {
    getTodo { id title completed }
  }
`;

const ADD_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) { id title completed }
  }
`;


export default function App() {

  const [todoTitle, setTodoTitle] = useState("");
  const { loading, error, data } = useQuery(GET_TODOS);
  const [createTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }], 
  });

   const handleAdd = async () => {
    if (!todoTitle) return;
    await createTodo({ variables: { title: todoTitle } });
    setTodoTitle("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;


  return (
    <div>
      <input
        value={todoTitle}
        onChange={(e) => setTodoTitle(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={handleAdd}>Add Todo</button>
      <h2>{JSON.stringify(data)}</h2>
    </div>
  );
}
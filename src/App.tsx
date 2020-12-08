import * as React from "react";
import ReactDOM from "react-dom";

interface Todo {
  content: string;
  complete: boolean;
}

interface State {
  todos: Todo[];
  input: string;
}

type Action =
  | {
      type: "add";
      payload: Todo;
    }
  | {
      type: "remove";
      payload: number;
    }
  | {
      type: "toggle";
      payload: number;
    }
  | {
      type: "inputChange";
      payload: string;
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      return {
        todos: [...state.todos, action.payload],
        input: "",
      };
    }
    case "remove": {
      return { ...state, todos: state.todos.filter((_, i) => i !== action.payload) };
    }
    case "toggle": {
      return {
        ...state,
        todos: state.todos.map((todo, i) =>
          action.payload == i ? { ...todo, complete: !todo.complete } : todo
        ),
      };
    }
    case "inputChange": {
      return {
        ...state,
        input: action.payload,
      };
    }
  }
}

function App() {
  const [{ todos, input }, dispatch] = React.useReducer(reducer, { todos: [], input: "" });

  return (
    <>
      <input
        value={input}
        onChange={(event) => dispatch({ type: "inputChange", payload: event.target.value })}
        onKeyPress={(event) =>
          event.key === "Enter" &&
          dispatch({
            type: "add",
            payload: {
              content: input,
              complete: false,
            },
          })
        }
      />
      <ol>
        {todos.length === 0 ? (
          <p>You haven't added anything to your list yet.</p>
        ) : (
          todos.map((todo, i) => (
            <li key={i}>
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => dispatch({ type: "toggle", payload: i })}
              />
              {todo.content}
            </li>
          ))
        )}
      </ol>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("react-root")!);

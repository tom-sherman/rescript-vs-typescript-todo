import React, { useReducer } from 'react';

type Todo =
  | { complete: false; content: string }
  | { complete: true; content: string; completedOn: Date };

type State = {
  todos: Todo[];
  input: string;
};

type Action =
  | {
      type: 'ADD';
    }
  | {
      type: 'REMOVE';
      payload: {
        id: number;
      };
    }
  | {
      type: 'TOGGLE';
      payload: {
        id: number;
      };
    }
  | {
      type: 'INPUT_CHANGE';
      payload: {
        value: string;
      };
    };

function appReducer(state: State, action: Action): State {
  // Mention what happens when we miss a case
  switch (action.type) {
    case 'ADD': {
      return {
        input: '',
        todos: [...state.todos, { complete: false, content: state.input }],
      };
    }

    case 'REMOVE': {
      return {
        ...state,
        todos: state.todos.filter((_, i) => i !== action.payload.id),
      };
    }

    case 'TOGGLE': {
      return {
        ...state,
        todos: state.todos.map((todo, i) => {
          if (i !== action.payload.id) {
            return todo;
          }

          return todo.complete
            ? { ...todo, complete: false }
            : { ...todo, complete: true, completedOn: new Date() };
        }),
      };
    }

    case 'INPUT_CHANGE': {
      return {
        ...state,
        input: action.payload.value,
      };
    }
  }
}

interface AppProps {}

function App({}: AppProps) {
  // React have done well on the types here by inferring the state from the type of appReducer
  // But you still need to type the appReducer manually where as in rescript it's fully inferred
  const [{ todos, input }, dispatch] = useReducer(appReducer, {
    todos: [],
    input: '',
  });
  return (
    <>
      <input
        value={input}
        onChange={(event) =>
          dispatch({
            type: 'INPUT_CHANGE',
            payload: {
              value: event.target.value,
            },
          })
        }
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            dispatch({
              type: 'ADD',
            });
          }
        }}
      />

      <ol>
        {todos.length === 0
          ? "You haven't added anything to your list yet."
          : todos.map((todo, i) => (
              <TodoItem
                key={i}
                todo={todo}
                onToggle={() =>
                  dispatch({
                    type: 'TOGGLE',
                    payload: {
                      id: i,
                    },
                  })
                }
              />
            ))}
      </ol>
    </>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => any;
}

function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <li>
      <input type="checkbox" checked={todo.complete} onChange={onToggle} />
      {todo.complete ? (
        <>
          <s>{todo.content}</s> {todo.completedOn.toString()}
        </>
      ) : (
        todo.content
      )}
    </li>
  );
}

export default App;

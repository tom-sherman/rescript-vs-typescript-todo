module Todo = {
  type t = Complete({content: string, completedOn: Js.Date.t}) | Incomplete({content: string})

  let toggle = todo =>
    switch todo {
    | Complete({content}) => Incomplete({content: content})
    | Incomplete({content}) => Complete({content: content, completedOn: Js.Date.make()})
    }

  let isComplete = todo =>
    switch todo {
    | Complete(_) => true
    | Incomplete(_) => false
    }
}

module TodoItem = {
  @react.component
  let make = (~onToggle, ~todo) =>
    <li>
      <input type_="checkbox" checked={todo->Todo.isComplete} onChange={_ => onToggle()} />
      {switch todo {
      | Incomplete({content}) => content->React.string
      | Complete({content, completedOn}) => <>
          <s> {content->React.string} </s>
          {React.string(" ")}
          {completedOn->Js.Date.toString->React.string}
        </>
      }}
    </li>
}

module App = {
  type state = {todos: array<Todo.t>, input: string}

  let defaultState = {todos: [], input: ""}

  type action = Add | Remove({id: int}) | Toggle({id: int}) | InputChange({value: string})

  let reducer = (state, action) =>
    switch action {
    | Add => {
        input: "",
        todos: state.todos->Js.Array2.concat([Incomplete({content: state.input})]),
      }
    | Remove({id}) => {...state, todos: state.todos->Js.Array2.filteri((_, i) => i != id)}
    | Toggle({id}) => {
        ...state,
        todos: state.todos->Js.Array2.mapi((todo, i) =>
          if id == i {
            todo->Todo.toggle
          } else {
            todo
          }
        ),
      }
    | InputChange({value}) => {...state, input: value}
    }

  @react.component
  let make = () => {
    let ({todos, input}, dispatch) = React.useReducer(reducer, defaultState)

    <>
      <input
        value={input}
        onChange={event => {
          let value = ReactEvent.Form.target(event)["value"]
          dispatch(InputChange({value: value}))
        }}
        onKeyPress={event =>
          if ReactEvent.Keyboard.key(event) === "Enter" {
            dispatch(Add)
          }}
      />
      {if todos->Js.Array2.length == 0 {
        <p> {React.string("You haven't added anything to your list yet.")} </p>
      } else {
        <ol>
          {todos
          ->Js.Array2.mapi((todo, i) =>
            <TodoItem
              key={i->Js.Int.toString} todo={todo} onToggle={() => dispatch(Toggle({id: i}))}
            />
          )
          ->React.array}
        </ol>
      }}
    </>
  }
}

ReactDOMRe.renderToElementWithId(<React.StrictMode> <App /> </React.StrictMode>, "react-root")

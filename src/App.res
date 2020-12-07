module App = {
  type todo = {complete: bool, content: string}
  type state = {todos: array<todo>, input: string}

  type action = Add(todo) | Remove(int) | Toggle(int) | InputChange(string)

  let reducer = (state, action) =>
    switch (state, action) {
    | ({todos}, Add(todo)) => {todos: todos->Js.Array2.concat([todo]), input: ""}
    | ({todos}, Remove(id)) => {...state, todos: todos->Js.Array2.filteri((_, i) => i !== id)}
    | ({todos}, Toggle(id)) => {
        ...state,
        todos: todos->Js.Array2.mapi((todo, i) =>
          id == i ? {...todo, complete: !todo.complete} : todo
        ),
      }
    | (_, InputChange(input)) => {...state, input: input}
    }

  @react.component
  let make = () => {
    let ({todos, input}, dispatch) = React.useReducer(reducer, {todos: [], input: ""})

    <>
      <input
        value={input}
        onChange={event => dispatch(InputChange(ReactEvent.Form.target(event)["value"]))}
        onKeyPress={event =>
          if ReactEvent.Keyboard.key(event) === "Enter" {
            dispatch(Add({content: input, complete: false}))
          }}
      />
      <ol>
        {todos
        ->Js.Array2.mapi((todo, i) =>
          <li key={Js.Int.toString(i)}>
            <input type_="checkbox" checked={todo.complete} onChange={_ => dispatch(Toggle(i))} />
            {todo.content->React.string}
          </li>
        )
        ->React.array}
      </ol>
    </>
  }
}

ReactDOMRe.renderToElementWithId(<App />, "react-root")

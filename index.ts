type State = any;

const local = async <T,>(name: string, fn: (state: State) => Promise<T>, getState: (oldState: State) => Promise<State>): Promise<(state: State) => Promise<T>> => {
    return async (oldState: State) => {
        const state = await getState(oldState)
        return fn(state);
    }
}

const run = async () => {

    const test = await local("local", (state) => Promise.resolve({"test": "test"} as const), (oldState) => Promise.resolve({
        ...oldState,
        newState: "test2"
    }))
    const chain = await local("local-2",
        (state) => {
            return Promise.all([test(state), test({})])
        },
        (oldState) => Promise.resolve({
            ...oldState,
            "test": "test"
        }))
    chain({})
}

run()
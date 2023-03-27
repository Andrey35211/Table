import { configureStore, createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        data: null
    },
    reducers: {
        setData (state, action) {
            state.data = action.payload
        }
    }
})

export const { setData } = mainSlice.actions

export const store = configureStore({
    reducer: mainSlice.reducer
})

export const data = [
    {
        id: '9s41rp',
        Name: 'МИК-РЛ400Р',
        weight: 21,
        Power: 55,
        termsOfUse: 'ГОСТ 27570.0-87',
        Comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel suscipit lectus. Nunc et pretium orci, eu dignissim augue.',
    },
    {
        id: '08m6rx',
        Name: 'МИК-РЛ Р500',
        weight: 13,
        Power: 100,
        termsOfUse: 'ГОСТ 15150-69',
        Comment: 'Nam vel suscipit lectus. Nunc et pretium orci, eu dignissim augue.',
    },
    {
        id: '5ymtrc',
        Name: 'FishGUARD',
        weight: 8,
        Power: 600,
        termsOfUse: 'ГОСТ 25565-88',
        Comment: 'Fusce lobortis libero non blandit cursus. Curabitur at quam tristique, consequat velit non, ullamcorper enim.',
    },
    {
        id: 'ek5b97',
        Name: 'IP2COM',
        weight: 1,
        Power: 35,
        termsOfUse: 'ГОСТ 30345.0-95',
        Comment: 'Curabitur at quam tristique',
    },
    {
        id: 'xxtydd',
        Name: 'ППМ К2М-101',
        weight: 30,
        Power: 750*3,
        termsOfUse: 'ГОСТ 15150-69',
        Comment: 'Williamson',
    },
    {
        id: 'wzxj9m',
        Name: 'МИК‑РЛ Н500',
        weight: 13,
        Power: 155,
        termsOfUse: 'ГОСТ 27570.0-87',
        Comment: 'Quisque in urna convallis lacus semper placerat ut pellentesque ipsum',
    },
    {
        id: '21dwtz',
        Name: 'ИКО-1G',
        weight: 2,
        Power: 20,
        termsOfUse: 'ГОСТ 16962-71',
        Comment: 'Praesent et metus volutpat odio vulputate egestas',
    },
    {
        id: 'o8oe4k',
        Name: 'РЕКА',
        weight: 52,
        Power: 200,
        termsOfUse: 'ГОСТ Р 52084-2003',
        Comment: 'Donec lorem mauris, tristique et tincidunt non, mollis id risus.',
    }
]

export const termsOfUse = [
    'ГОСТ Р 52084-2003',
    'ГОСТ 16962-71',
    'ГОСТ 27570.0-87',
    'ГОСТ 15150-69',
    'ГОСТ 30345.0-95',
    'ГОСТ Р МЭК 335-1-94',
    'ГОСТ 25565-88',
]



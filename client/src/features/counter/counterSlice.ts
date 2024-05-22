import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchCount } from './counterAPI';

// Перечисление типов действий
export enum CounterActionTypes {
  INCREMENT = 'counter/increment',
  DECREMENT = 'counter/decrement',
  INCREMENT_BY_AMOUNT = 'counter/incrementByAmount',
  FETCH_COUNT = 'counter/fetchCount',
}

// Интерфейсы для действий
export interface IncrementAction {
  type: typeof CounterActionTypes.INCREMENT;
}

export interface DecrementAction {
  type: typeof CounterActionTypes.DECREMENT;
}

export interface IncrementByAmountAction {
  type: typeof CounterActionTypes.INCREMENT_BY_AMOUNT;
  payload: number;
}

export type CounterActions = IncrementAction | DecrementAction | IncrementByAmountAction;

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

// Функция ниже называется thunk и позволяет выполнять асинхронную логику. Ее
// можно отправлять как обычное действие: `dispatch(incrementAsync(10))`. Это
// вызовет thunk с функцией `dispatch` в качестве первого аргумента. Затем может
// быть выполнен асинхронный код и могут быть отправлены другие действия. Thunks
// обычно используются для выполнения асинхронных запросов.
export const incrementAsync = createAsyncThunk(
  CounterActionTypes.FETCH_COUNT,
  async (amount: number) => {
    const response = await fetchCount(amount);
    // Значение, которое мы возвращаем, становится `fulfilled` payload для действия
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // Поле `reducers` позволяет нам определять редьюсеры и генерировать связанные с ними действия
  reducers: {
    increment: (state): CounterState => {
      state.value += 1;
      return state;
    },
    decrement: (state): CounterState => {
      state.value -= 1;
      return state;
    },
    // Используем тип PayloadAction для объявления содержимого `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>): CounterState => {
      state.value += action.payload;
      return state;
    },
  },
  // Поле `extraReducers` позволяет slice обрабатывать действия, определенные в других местах,
  // включая действия, сгенерированные createAsyncThunk или в других slice.
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Функция ниже называется селектор и позволяет нам выбирать значение из состояния.
// Селекторы также можно определять встроенно, там где они используются, вместо
// определения в файле slice. Например: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value;

// Мы также можем писать thunks вручную, которые могут содержать как синхронную, так и асинхронную логику.
// Вот пример условного отправления действий на основе текущего состояния.
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };

export default counterSlice.reducer;













// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState, AppThunk } from '../../app/store';
// import { fetchCount } from './counterAPI';

// export interface CounterState {
//   value: number;
//   status: 'idle' | 'loading' | 'failed';
// }

// const initialState: CounterState = {
//   value: 0,
//   status: 'idle',
// };

// // The function below is called a thunk and allows us to perform async logic. It
// // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// // will call the thunk with the `dispatch` function as the first argument. Async
// // code can then be executed and other actions can be dispatched. Thunks are
// // typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

// export const counterSlice = createSlice({
//   name: 'counter',
//   initialState,
//   // The `reducers` field lets us define reducers and generate associated actions
//   reducers: {
//     increment: (state) => {
//       // Redux Toolkit allows us to write "mutating" logic in reducers. It
//       // doesn't actually mutate the state because it uses the Immer library,
//       // which detects changes to a "draft state" and produces a brand new
//       // immutable state based off those changes
//       state.value += 1;
//     },
//     decrement: (state) => {
//       state.value -= 1;
//     },
//     // Use the PayloadAction type to declare the contents of `action.payload`
//     incrementByAmount: (state, action: PayloadAction<number>) => {
//       state.value += action.payload;
//     },
//   },
//   // The `extraReducers` field lets the slice handle actions defined elsewhere,
//   // including actions generated by createAsyncThunk or in other slices.
//   extraReducers: (builder) => {
//     builder
//       .addCase(incrementAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(incrementAsync.fulfilled, (state, action) => {
//         state.status = 'idle';
//         state.value += action.payload;
//       })
//       .addCase(incrementAsync.rejected, (state) => {
//         state.status = 'failed';
//       });
//   },
// });

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// // The function below is called a selector and allows us to select a value from
// // the state. Selectors can also be defined inline where they're used instead of
// // in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

// // We can also write thunks by hand, which may contain both sync and async logic.
// // Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

// export default counterSlice.reducer;

import { useDispatch, useSelector, useStore } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from './store'

// 액션 타입을 AppDispatch로 제한
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// useSelector가 선택할 타입을 RootState로 제한함으로써, 선언할 때 명시적으로 타입 설정 필요 X
export const useAppSelector = useSelector.withTypes<RootState>()
// 스토어의 타입을 AppStore로 제한
export const useAppStore = useStore.withTypes<AppStore>()
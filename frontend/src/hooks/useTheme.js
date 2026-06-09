import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";

const useTheme = () => {
    
    const dispatch = useDispatch();
    const mode = useSelector(s => s.theme.mode);

    return { 
        mode, 
        isDark: mode === 'dark', 
        toggle: () => dispatch(toggleTheme()) 
    }
}

export default useTheme;
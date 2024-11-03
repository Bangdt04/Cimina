import MovieData from "./MovieData";
import { useState } from "react";
import MovieHead from "./MovieHead";

function MoviePage() {
    const [params, setParams] = useState({
        pageNo: 1,
        pageSize: 5,
    });
    return (
        <div className="category-container">
            <MovieHead />
            <MovieData params={params} setParams={setParams} />
        </div>
    );
}

export default MoviePage;
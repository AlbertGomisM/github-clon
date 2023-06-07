import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";


export default function User() {

    const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true })

    const [userDisplayed, setUserDisplayed] = useState("AlbertGomisM")

    const onSubmit = async (data: any) => {
        setUserDisplayed(data.user)
    };

    type Inputs = {
        search: string,
    };

    const [search, setSearch] = useState<string>("");
    const [searchDisplay, setSearchDisplay] = useState<Repo[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        setSearchDisplay([]);

        if (search.length >= 3) {
            const searchResults = reposDisplay
                .filter(repo => repo.repoName.includes(search))
                .map(repo => repo);

            setSearchDisplay(searchResults);
        }
    }, [search]);

    useEffect(() => {
        console.log("search", searchDisplay);
    }, [searchDisplay]);


    interface Person {
        userID: number,
        userName: string,
        userImg: string,
        userRepos: number,
        followers: number,
        following: number,
        bio: string,
        login: string,
        email: string
    }

    interface Repo {
        repoName: string,
        description: string,
        language: string,
        fork: number,
        updated: string
    }

    const [user, setUser] = useState<Person>({
        userID: 0,
        userName: "",
        userImg: "",
        userRepos: 0,
        followers: 0,
        following: 0,
        bio: "",
        login: "",
        email: ""
    })

    const [repos, setRepos] = useState<Repo[]>([])

    useEffect(() => {
        setRepos([])
        fetch(`https://api.github.com/users/${userDisplayed}`, {
            headers: {
                Authorization: `Bearer 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`
            }
        })
            .then(res => res.json())
            .then(user => {
                setUser({
                    userID: user.id,
                    userName: user.name,
                    userImg: user.avatar_url,
                    userRepos: user.public_repos,
                    followers: user.followers,
                    following: user.following,
                    bio: user.bio,
                    login: user.login,
                    email: user.email
                }
                )
            }
            )
        fetch(`https://api.github.com/users/${userDisplayed}/repos`, {
            headers: {
                Authorization: `Bearer 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`
            }
        })
            .then(res => res.json())
            .then(receivedRepos => {
                for (const repo of receivedRepos) {
                    setRepos(
                        prevState => [...prevState, {
                            repoName: repo.name,
                            description: repo.description,
                            language: repo.language,
                            fork: repo.forks_count,
                            updated: repo.updated_at
                        }],

                    )
                }
            })

    }, [userDisplayed])

    const reposDisplay: Repo[] = repos.slice(0, user.userRepos)

    console.log(reposDisplay[0]);
    console.log(Date.now())


    return (
        <div className="container">
            <div className="col">
                <div className="row">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" defaultValue={"AlbertGomisM"} {...register("user")} />
                        <button>Search User</button>
                    </form>
                    <div className="col">Hola</div>
                    <div className="col">Que tal?</div>
                    <div className="col">Bien</div>
                </div>
                <div className="row mt-5">
                    <div className="col col-lg-3">
                        <div className="lg-3">
                            <img className="rounded-circle img-fluid" src={user.userImg} alt="profile IMG" />
                            <h2>{user.userName}</h2>
                            <p>{user.login}</p>
                            <p>{user.bio}</p>
                            <button>Follow</button>
                            <div className="row">
                                <p className="col">{user.followers} Followers</p>
                                <p className="col">{user.following} Following</p>
                            </div>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <input type="text" onChange={handleSearch} placeholder="Search a repo"/>
                        </div>
                        <div>
                            {(searchDisplay.length > 0) ?
                                searchDisplay.map((repo) => (
                                    <>
                                        <p>{repo.repoName}</p>
                                        {repo.description !== null && <p>{repo.description}</p>}
                                        <p>{Math.trunc((Date.now() - (new Date(repo.updated).getTime())) / 86400 / 1000)} days ago</p>

                                    </>
                                )
                                ) :
                                reposDisplay.map((repo) => (
                                    <>
                                        <p>{repo.repoName}</p>
                                        {repo.description !== null && <p>{repo.description}</p>}
                                        {repo.language !== null && <p>{repo.language}</p>}
                                        {repo.fork > 0 && <p>Forks: {repo.fork}</p>}
                                        <p>Updated {Math.trunc((Date.now() - (new Date(repo.updated).getTime())) / 86400 / 1000)} days ago</p>
                                    </>
                                )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
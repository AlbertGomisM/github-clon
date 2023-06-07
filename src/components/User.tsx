import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
import { BsFillChatRightHeartFill } from "react-icons/bs"


export default function User() {

    const { register, handleSubmit } = useForm({ shouldUseNativeValidation: true })

    const [userDisplayed, setUserDisplayed] = useState("midudev")

    const onSubmit = async (data: any) => {
        setUserDisplayed(data.user)
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
                        <div  className="col align-items-center">
                            <input type="text" defaultValue={"midudev"} {...register("user")} />
                            <button className="btn btn-primary">Search User</button>
                        </div>
                    </form>
                    <div className="col btn">Overview</div>
                    <div className="col btn">Profile</div>
                    <div className="col btn">Projects</div>
                </div>
                <div className="row mt-5">
                    <div className="col col-lg-3">
                        <div className="lg-3">
                            <img className="rounded-circle img-fluid w-75" src={user.userImg} alt="profile IMG" />
                            <h2>{user.userName}</h2>
                            <p>{user.login}</p>
                            <p>{user.bio}</p>
                            <button className="btn btn-primary">Follow</button>
                            <div className="row mt-4">
                                <p className="col">{user.followers} Followers</p>
                                <p className="col">{user.following} Following</p>
                            </div>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-3 text-start">
                            <input type="text" onChange={handleSearch} placeholder="Search a repo " className="mb-3 align-self-start" />
                        </div>
                        <div>
                            {(searchDisplay.length > 0) ?
                                searchDisplay.map((repo) => (
                                    <>
                                        <div className="row border-top pt-3 pb-3 " >
                                        <div className="col-8 text-start">
                                            <h2 className="text-primary h3">{repo.repoName}</h2>
                                            {repo.description !== null && <p>{repo.description}</p>}
                                            <div className="row">
                                                {repo.language !== null && <p className="col small">{repo.language}</p>}
                                                {repo.fork > 0 && <p className="col small">Forks: {repo.fork}</p>}
                                                <p className="col small">Updated {Math.trunc((Date.now() - (new Date(repo.updated).getTime())) / 86400 / 1000)} days ago</p>
                                            </div>
                                        </div>
                                        <div className="col">
                                        <BsFillChatRightHeartFill />
                                        </div>
                                    </ div>
                                    </>
                                )
                                ) :
                                reposDisplay.map((repo) => (
                                    <div className="row border-top pt-3 pb-3 " >
                                        <div className="col-8 text-start">
                                            <h2 className="text-primary h3">{repo.repoName}</h2>
                                            {repo.description !== null && <p>{repo.description}</p>}
                                            <div className="row">
                                                {repo.language !== null && <p className="col small">{repo.language}</p>}
                                                {repo.fork > 0 && <p className="col small">Forks: {repo.fork}</p>}
                                                <p className="col small">Updated {Math.trunc((Date.now() - (new Date(repo.updated).getTime())) / 86400 / 1000)} days ago</p>
                                            </div>
                                        </div>
                                        <div className="col">
                                        <BsFillChatRightHeartFill />
                                        </div>
                                    </ div>
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
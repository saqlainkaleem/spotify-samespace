import { useEffect, useState } from "react";
import ListItem from "../components/ListItem";
import Frame from "../assets/Frame.svg";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import logo from "../assets/Logo.svg";
import profile from "../assets/Profile.svg";
import { fetchAPI } from "./fetchAPI";
import { FaEllipsisH } from "react-icons/fa";

const TABS = {
	for_you: "for_you",
	top_tracks: "top_tracks",
};

const Home = () => {
	const [songs, setSongs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedSong, setSelectedSong] = useState({});
	const [activeTab, setActiveTab] = useState(TABS.for_you);
	const [filteredData, setFilteredData] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [showList, setShowList] = useState(true);

	useEffect(() => {
		const fetchSongs = async () => {
			try {
				const responsedata = await fetchAPI(); // Fetch data from API
				console.log(responsedata.data);
				setSongs(responsedata.data || []); // Initialize songs with data.data
			} catch (err) {
				setError(err); // Handle errors
			} finally {
				setLoading(false); // Set loading state to false
			}
		};

		fetchSongs();
	}, []);

	useEffect(() => {
		if (!loading) {
			setFilteredData(songs);
		}
	}, [loading, songs]);

	useEffect(() => {
		if (activeTab === TABS.top_tracks) {
			const topTracks = songs.filter((item) => item.top_track === true);
			setFilteredData(topTracks);
		} else if (activeTab === TABS.for_you) {
			setFilteredData(songs);
		}
	}, [activeTab, songs]);

	const handleNext = (data) => {
		const id = data.id;
		const index = filteredData.findIndex((item) => item.id === id);
		setSelectedSong(filteredData[(index + 1) % filteredData.length]);
	};

	const handlePrev = (data) => {
		const id = data.id;
		const index = filteredData.findIndex((item) => item.id === id);
		setSelectedSong(
			filteredData[(index - 1 + filteredData.length) % filteredData.length]
		);
	};

	const handleSearch = (param1) => {
		setSearchValue(param1.toLowerCase());
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div
			className="homepage flex min-h-screen p-8 bg-gradient-to-br from-[#33425E99] to-[#00000099] bg-black"
			style={{
				background: `linear-gradient(108deg, ${
					selectedSong.accent || "#000"
				}, rgba(0, 0, 0, 0.60) 99.84%), #000`,
			}}
		>
			<div className="sidebar flex flex-col justify-between w-full md:w-1/4">
				<div>
					<img src={logo} alt="logo" />
				</div>
				<div>
					<img src={profile} alt="profile" />
				</div>
			</div>

			<div
				className="show_list text-white border border-gray-600 rounded px-2 py-1 cursor-pointer"
				onClick={() => setShowList(!showList)}
			>
				{!showList ? "Show List" : "Hide List"}
			</div>

			<div
				className={`middle flex flex-col gap-5 w-full md:w-1/3 ${
					showList ? "" : "hidden"
				}`}
			>
				<div className="topbar flex items-center gap-10">
					<div
						onClick={() => setActiveTab(TABS.for_you)}
						className={`for_you text-white text-2xl font-bold cursor-pointer ${
							activeTab === TABS.for_you ? "" : "opacity-50"
						}`}
					>
						For You
					</div>
					<div
						onClick={() => setActiveTab(TABS.top_tracks)}
						className={`top_tracks text-white text-2xl font-bold cursor-pointer ${
							activeTab === TABS.top_tracks ? "" : "opacity-50"
						}`}
					>
						Top Tracks
					</div>
				</div>

				<div className="search_bar flex items-center justify-between px-4 py-2 rounded bg-white bg-opacity-10 text-white text-lg border-none outline-none">
					<input
						className="bg-transparent border-none outline-none text-white text-lg"
						placeholder="Search Song, Artist"
						onChange={(event) => handleSearch(event.target.value)}
					/>
					<img src={Frame} alt="search" />
				</div>

				<div className="list_item_container flex flex-col overflow-scroll max-h-[calc(100vh-250px)]">
					{Array.isArray(filteredData) &&
						filteredData
							.filter(
								(data) =>
									data.name.toLowerCase().includes(searchValue) ||
									data.artist.toLowerCase().includes(searchValue)
							)
							.map((item, index) => (
								<ListItem
									icon={item.cover}
									artist={item.artist}
									name={item.name}
									data={item}
									selectedSong={selectedSong}
									setSelectedSong={setSelectedSong}
									key={index}
								/>
							))}
				</div>
			</div>

			{selectedSong && Object.keys(selectedSong).length > 0 && (
				<div
					className={`media-player ${
						showList ? "hidden" : "flex"
					} flex-col items-center mx-4 md:mx-16 w-full md:w-2/5`}
				>
					<div className="played_songs_details flex flex-col items-center">
						<div className="song_played text-white text-3xl font-bold mb-2">
							{selectedSong.name}
						</div>
						<div className="artist_played text-white text-lg font-normal opacity-60">
							{selectedSong.artist}
						</div>
					</div>

					<div className="cover_art_container my-8 w-full max-w-[480px]">
						<img
							src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
							alt="cover"
							className="cover_art rounded-lg w-full"
						/>
					</div>

					<div className="custom-audio-player flex items-center w-full max-w-[480px]">
						<span
							className="menu-icon flex items-center justify-center cursor-pointer"
							key={1}
						>
							<FaEllipsisH size={24} />
						</span>
						<AudioPlayer
							autoPlay
							src={selectedSong.url}
							showSkipControls={true}
							showJumpControls={false}
							onClickNext={() => handleNext(selectedSong)}
							onClickPrevious={() => handlePrev(selectedSong)}
							onEnded={() => handleNext(selectedSong)}
							className="player"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;

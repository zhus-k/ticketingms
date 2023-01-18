import { selectCurrentUserData } from "../selectors/auth";
import Link from "next/link";
import { useSelector } from "react-redux";

const Header = () => {
	const currentUser = useSelector(selectCurrentUserData);
	const links = [
		// !currentUser && { label: "Sign Up", href: "/auth/signup" },
		!currentUser && { label: "Sign In", href: "/auth/signin" },
		currentUser && { label: "List Ticket", href: "/tickets/new" },
		currentUser && { label: "My Orders", href: "/orders" },
		currentUser && { label: "Sign Out", href: "/auth/signout" },
	]
		.filter((linkConfig) => linkConfig)
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		.map(({ label, href }: any) => {
			return (
				<li key={href} className="hover:backdrop-contrast-75 py-1 px-2 rounded">
					<Link href={href}>{label}</Link>
				</li>
			);
		});

	return (
		<nav className="flex justify-between items-center p-4 bg-accent">
			<Link href="/" className="font-semibold text-2xl">
				Ticketing
			</Link>
			<div>
				<ul className="flex flex-initial list-none items-center gap-2">
					{links}
				</ul>
			</div>
		</nav>
	);
};

export default Header;

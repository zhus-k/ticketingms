import Link from "next/link";

import { _Props } from "../interface/appProps";

const Header = ({ currentUser }: _Props): JSX.Element => {
	const links = [
		!currentUser && { label: "Sign Up", href: "/auth/signup" },
		!currentUser && { label: "Sign In", href: "/auth/signin" },
		currentUser && { label: "List Tickets", href: "/tickets/new" },
		currentUser && { label: "My Orders", href: "/orders" },
		currentUser && { label: "Sign Out", href: "/auth/signout" },
	]
		.filter((linkConfig) => linkConfig)
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		.map(({ label, href }: any) => {
			return (
				<li key={href} className="nav-item">
					<Link href={href} className="nav-link">
						{label}
					</Link>
				</li>
			);
		});

	return (
		<nav className="navbar navbar-light bg-light">
			<Link href="/" className="navbar-brand">
				Ticketing
			</Link>

			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-items-center">{links}</ul>
			</div>
		</nav>
	);
};

export default Header;

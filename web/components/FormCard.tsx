import { ReactNode } from "react";

export const FormCard = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex justify-center min-h-screen">
			<div className="flex flex-col justify-center gap-8 pt-8 pb-48">
				{children}
			</div>
		</div>
	);
};

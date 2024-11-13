// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { PinataSDK } from "pinata";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: Home,
});

export const uploadFile = createServerFn("POST", async (formData: FormData) => {
	const pinata = new PinataSDK({
		pinataJwt: import.meta.env.VITE_PINATA_JWT,
		pinataGateway: "dweb.mypinata.cloud",
	});

	const file = formData.get("file") as unknown as File;
	const { cid } = await pinata.upload.file(file);
	const url = await pinata.gateways.createSignedURL({
		cid: cid,
		expires: 30,
	});
	return url;
});

function Home() {
	const [url, setUrl] = useState<string>();

	return (
		<div>
			<form
				onSubmit={async (event) => {
					event.preventDefault();
					const formData = new FormData(event.target);
					const response = await uploadFile(formData);
					setUrl(response);
				}}
			>
				<input type="file" name="file" accept="image/*" />
				<button type="submit">Submit</button>
			</form>
			{url && <img src={url} alt="img" />}
		</div>
	);
}

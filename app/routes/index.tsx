// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { PinataSDK } from "pinata";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
		<div className="min-h-screen w-full flex flex-col gap-2 items-center justify-center">
			<form
				className="flex flex-col gap-2"
				onSubmit={async (event) => {
					event.preventDefault();
					const formData = new FormData(event.target);
					const response = await uploadFile(formData);
					setUrl(response);
				}}
			>
				<Input type="file" name="file" accept="image/*" />
				<Button type="submit">Submit</Button>
			</form>
			{url && <img className="max-w-[500px]" src={url} alt="img" />}
		</div>
	);
}

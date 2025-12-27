import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const PhotoEditor = () => {
    const t = useTranslations("Pages.Effects.PhotoEditor");

    const items = [
        {
            id: 1,
            name: t("LowAngle"),
            url: "/low-angle",
            image: "/effects/edit/low-angle.jpg"
        },
        {
            id: 2,
            name: t("LongShot"),
            url: "/long-shot",
            image: "/effects/edit/long-shot.jpg"
        },
        {
            id: 3,
            name: t("FromAHeight"),
            url: "/from-a-height",
            image: "/effects/edit/from-a-height.jpg"
        },
        {
            id: 4,
            name: t("FromBack"),
            url: "/from-back",
            image: "/effects/edit/from-back.jpg"
        },
        {
            id: 5,
            name: t("Profile"),
            url: "/profile",
            image: "/effects/edit/profile.jpg"
        },
        {
            id: 6,
            name: t("AntiBlur"),
            url: "/anti-blur",
            image: "/effects/edit/anti-blur.jpg"
        },
        {
            id: 7,
            name: t("RemovePeople"),
            url: "/anti-blur",
            image: "/effects/edit/remove-people.jpg"
        },
        {
            id: 8,
            name: t("OwnRequest"),
            url: "/own-request",
            image: "/effects/edit/own-request.jpg"
        },
    ]

    return (
        <section className="flex flex-col section-padding ">
            <h1 className="title-text my-4">Фоторедактор</h1>
            <div className="grid-4 gap-6!">
                {items.map((item) => (
                    <Link
                        href={`/create/photo-effects/editor/${item.url}`}
                        key={item.id}
                        className="flex flex-col items-start justify-start hover:scale-102 magic-transition cursor-pointer"
                    >
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={300}
                            height={300}
                            className="rounded-2xl object-contain w-full"
                        />

                        <div className="mt-2 font-medium">{item.name}</div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
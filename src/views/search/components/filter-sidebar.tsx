import styles from "./filter-sidebar.module.scss";
import { LargeButton } from "components/button/button";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { CSSProperties } from "preact/compat";
import { FilterSection } from "./filter-section";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { ExtendedTag, ExtendedUnicorn, SortType } from "./types";
import { DEFAULT_TAG_EMOJI } from "./constants";
import { Item, Select } from "components/select/select";

interface FilterSidebar {
	unicornProfilePicMap: ProfilePictureMap;
	desktopStyle?: CSSProperties;
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	selectedAuthorIds: string[];
	setSelectedAuthorIds: (authors: string[]) => void;
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	onSelectedAuthorChange: (authorId: string) => void;
	onTagsChange: (tag: string) => void;
	searchString: string;
}

export const FilterSidebar = ({
	sort,
	setSort,
	selectedAuthorIds,
	selectedTags,
	setSelectedAuthorIds,
	setSelectedTags,
	desktopStyle,
	onSelectedAuthorChange,
	onTagsChange,
	authors,
	tags,
	unicornProfilePicMap,
	searchString,
}: FilterSidebar) => {
	const hideSearchbar = !searchString;
	return (
		<div
			className={`${styles.sidebarContainer}`}
			style={{
				...desktopStyle,
			}}
			inert={hideSearchbar}
		>
			<LargeButton
				tag="button"
				type="button"
				class={styles.jumpToContents}
				onClick={() =>
					(document.querySelector("#search-bar") as HTMLInputElement).focus()
				}
			>
				Jump to search bar
			</LargeButton>
			<Select
				testId={"sort-order-group-sidebar"}
				className={styles.sortSelect}
				label={"Post sort order"}
				prefixSelected={"Sort by: "}
				defaultValue={"Relevance"}
				selectedKey={sort}
				onSelectionChange={(v) => setSort(v)}
			>
				<Item key={"relevance"}>Relevance</Item>
				<Item key={"newest"}>Newest</Item>
				<Item key={"oldest"}>Oldest</Item>
			</Select>
			<FilterSection
				title={"Tag"}
				data-testid="tag-filter-section-sidebar"
				selectedNumber={selectedTags.length}
				onClear={() => setSelectedTags([])}
			>
				{tags.map((tag, i) => {
					return (
						<FilterSectionItem
							count={tag.numPosts}
							icon={
								tag.image ? (
									<img src={tag.image} alt="" className={styles.tagImage} />
								) : tag.emoji ? (
									<span className={styles.tagEmoji}>{tag.emoji}</span>
								) : (
									<span className={styles.tagEmoji}>
										{DEFAULT_TAG_EMOJI[i % DEFAULT_TAG_EMOJI.length]}
									</span>
								)
							}
							label={tag?.displayName ?? tag.tag}
							selected={selectedTags.includes(tag.tag)}
							onChange={() => onTagsChange(tag.tag)}
						/>
					);
				})}
			</FilterSection>
			<FilterSection
				title={"Author"}
				data-testid="author-filter-section-sidebar"
				selectedNumber={selectedAuthorIds.length}
				onClear={() => setSelectedAuthorIds([])}
			>
				{authors.map((author) => {
					return (
						<FilterSectionItem
							count={author.numPosts}
							icon={
								<UUPicture
									picture={unicornProfilePicMap.find((u) => u.id === author.id)}
									alt={""}
									class={styles.authorIcon}
								/>
							}
							label={author.name}
							selected={selectedAuthorIds.includes(author.id)}
							onChange={() => onSelectedAuthorChange(author.id)}
						/>
					);
				})}
			</FilterSection>
		</div>
	);
};
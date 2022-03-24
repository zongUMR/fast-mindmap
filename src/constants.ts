export enum LAYOUT_ANGLE_ENUM {
    Right = 0,
    Down = 90,
    Left = 180,
    Up = 270,
}

export enum LAYOUT_SORTING_ENUM {
    Forwards = "SortingForwards",
    Reverse = "SortingReverse",
    Ascending = "SortingAscending",
    Descending = "SortingDescending",
}

export const LAYOUT_ANGLE = [
    {
        label: "Right",
        value: LAYOUT_ANGLE_ENUM.Right,
    },
    {
        label: "Down",
        value: LAYOUT_ANGLE_ENUM.Down,
    },
    {
        label: "Left",
        value: LAYOUT_ANGLE_ENUM.Left,
    },
    {
        label: "Up",
        value: LAYOUT_ANGLE_ENUM.Up,
    },
];
export const LAYOUT_ALIGNMENT = [
    {
        label: "centerChildren",
        value: "AlignmentCenterChildren",
    },
    {
        label: "centerSubstress",
        value: "AlignmentCenterSubtrees",
    },
    {
        label: "start",
        value: "AlignmentStart",
    },
    {
        label: "end",
        value: "AlignmentEnd",
    },
    {
        label: "bus",
        value: "AlignmentBus",
    },
    {
        label: "topLeftBus",
        value: "AlignmentTopLeftBus",
    },
];

export const INIT_LAYOUT_OPTIONS = {
    angle: 0,
    alignment: "AlignmentCenterChildren",
    sorting: LAYOUT_SORTING_ENUM.Forwards,
};

export const LAYOUT_SORTING = [
    {
        label: "正序",
        value: LAYOUT_SORTING_ENUM.Forwards,
    },
    {
        label: "倒序",
        value: LAYOUT_SORTING_ENUM.Reverse,
    },
    {
        label: "升序",
        value: LAYOUT_SORTING_ENUM.Ascending,
    },
    {
        label: "降序",
        value: LAYOUT_SORTING_ENUM.Descending,
    },
];

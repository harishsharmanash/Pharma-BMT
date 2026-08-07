# HIG — extracted tables (concrete values)


### accessibility — table (6 rows)

| Platform | Default size | Minimum size |
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| tvOS | 29 pt | 23 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |

### accessibility — table (4 rows)

| Text size | Text weight | Minimum contrast ratio |
| Up to 17 pts | All | 4.5:1 |
| 18 pts | All | 3:1 |
| All | Bold | 3:1 |

### accessibility — table (6 rows)

| Platform | Default control size | Minimum control size |
| iOS, iPadOS | 44x44 pt | 28x28 pt |
| macOS | 28x28 pt | 20x20 pt |
| tvOS | 66x66 pt | 56x56 pt |
| visionOS | 60x60 pt | 28x28 pt |
| watchOS | 44x44 pt | 28x28 pt |

### accessibility — table (6 rows)

| Date | Changes |
| June 9, 2025 | Added guidance and links for Assistive Access, Switch Control, and Accessibility Nutrition Labels. |
| March 7, 2025 | Expanded and refined all guidance. Moved Dynamic Type guidance to the Typography page, and moved VoiceOver guidance to a new VoiceOver page. |
| June 10, 2024 | Added a link to Apple’s Unity plug-ins for supporting Dynamic Type. |
| December 5, 2023 | Updated visionOS Zoom lens artwork. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### action-sheets — table (4 rows)

| Style | Meaning |
| Default | The button has no special meaning. |
| Destructive | The button destroys user data or performs a destructive action in the app. |
| Cancel | The button dismisses the view without taking any action. |

### activity-rings — table (2 rows)

| Move | Exercise | Stand |
|  |  |  |

### activity-rings — table (3 rows)

| Date | Changes |
| March 29, 2024 | Enhanced guidance for displaying Activity rings and listed specific colors for displaying related content. |
| December 5, 2023 | Added artwork representing Activity rings in iOS. |

### alerts — table (4 rows)

| Action | Platform |
| Exit to the Home Screen | iOS, iPadOS |
| Pressing Escape (Esc) or Command-Period (.) on an attached keyboard | iOS, iPadOS, macOS, visionOS |
| Pressing Menu on the remote | tvOS |

### alerts — table (4 rows)

| Date | Changes |
| February 2, 2024 | Enhanced guidance for using default and Cancel buttons. |
| September 12, 2023 | Added anatomy artwork for visionOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### app-icons — table (5 rows)

| Platform | Layout shape | Icon shape after system masking | Layout size | Style | Appearances |
| iOS, iPadOS, macOS | Square | Rounded rectangle (square) | 1024x1024 px | Layered | Default, dark, clear light, clear dark, tinted light, tinted dark |
| tvOS | Rectangle (landscape) | Rounded rectangle (rectangular) | 800x480 px | Layered (Parallax) | N/A |
| visionOS | Square | Circular | 1024x1024 px | Layered (3D) | N/A |
| watchOS | Square | Circular | 1088x1088 px | Layered | N/A |

### app-icons — table (7 rows)

| Date | Changes |
| June 8, 2026 | Refined guidance for Liquid Glass. |
| June 9, 2025 | Updated guidance to reflect layered icons, consistency across platforms, and best practices for Liquid Glass. |
| June 10, 2024 | Added guidance for creating dark and tinted app icon variants for iOS and iPadOS. |
| January 31, 2024 | Clarified platform availability for alternate app icons. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | Added specifications for Apple Watch Ultra. |

### app-shortcuts — table (4 rows)

| Date | Changes |
| June 8, 2026 | Added guidance for adopting app schemas. |
| January 17, 2025 | Updated and streamlined guidance. |
| June 5, 2023 | New page. |

### buttons — table (4 rows)

| View style | Help button location |
| Dialog with dismissal buttons (like OK and Cancel) | Lower corner, opposite to the dismissal buttons and vertically aligned with them |
| Dialog without dismissal buttons | Lower-left or lower-right corner |
| Settings window or pane | Lower-left or lower-right corner |

### buttons — table (5 rows)

| Shape | Mini (28 pt) | Small (32 pt) | Regular (44 pt) | Large (52 pt) | Extra large (64 pt) |
| Circular |  |  |  |  |  |
| Capsule (text only) |  |  |  |  |  |
| Capsule (text and icon) |  |  |  |  |  |
| Rounded rectangle |  |  |  |  |  |

### buttons — table (7 rows)

| Date | Changes |
| December 16, 2025 | Updated guidance for Liquid Glass. |
| June 9, 2025 | Updated guidance for button styles and content. |
| February 2, 2024 | Noted that visionOS buttons don’t support custom hover effects. |
| December 5, 2023 | Clarified some terminology and guidance for buttons in visionOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using buttons in watchOS. |

### charting-data — table (2 rows)

| Date | Changes |
| September 23, 2022 | New page. |

### charts — table (2 rows)

| Date | Changes |
| September 23, 2022 | New page. |

### collaboration-and-sharing — table (4 rows)

| Date | Changes |
| December 5, 2023 | Added artwork illustrating button placement and various types of collaboration permissions. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | New page. |

### color — table (9 rows)

| Color | Use for… | UIKit API |
| Label | A text label that contains primary content. |  |
| Secondary label | A text label that contains secondary content. |  |
| Tertiary label | A text label that contains tertiary content. |  |
| Quaternary label | A text label that contains quaternary content. |  |
| Placeholder text | Placeholder text in controls or text views. |  |
| Separator | A separator that allows some underlying content to be visible. |  |
| Opaque separator | A separator that doesn’t allow any underlying content to be visible. |  |
| Link | Text that functions as a link. |  |

### color — table (36 rows)

| Color | Use for… | AppKit API |
| Alternate selected control text color | The text on a selected surface in a list or table. |  |
| Alternating content background colors | The backgrounds of alternating rows or columns in a list, table, or collection view. |  |
| Control accent | The accent color people select in System Settings. |  |
| Control background color | The background of a large interface element, such as a browser or table. |  |
| Control color | The surface of a control. |  |
| Control text color | The text of a control that is available. |  |
| Current control tint | The system-defined control tint. |  |
| Unavailable control text color | The text of a control that’s unavailable. |  |
| Find highlight color | The color of a find indicator. |  |
| Grid color | The gridlines of an interface element, such as a table. |  |
| Header text color | The text of a header cell in a table. |  |
| Highlight color | The virtual light source onscreen. |  |
| Keyboard focus indicator color | The ring that appears around the currently focused control when using the keyboard for interface navigation. |  |
| Label color | The text of a label containing primary content. |  |
| Link color | A link to other content. |  |
| Placeholder text color | A placeholder string in a control or text view. |  |
| Quaternary label color | The text of a label of lesser importance than a tertiary label, such as watermark text. |  |
| Secondary label color | The text of a label of lesser importance than a primary label, such as a label used to represent a subheading or additional information. |  |
| Selected content background color | The background for selected content in a key window or view. |  |
| Selected control color | The surface of a selected control. |  |
| Selected control text color | The text of a selected control. |  |
| Selected menu item text color | The text of a selected menu. |  |
| Selected text background color | The background of selected text. |  |
| Selected text color | The color for selected text. |  |
| Separator color | A separator between different sections of content. |  |
| Shadow color | The virtual shadow cast by a raised object onscreen. |  |
| Tertiary label color | The text of a label of lesser importance than a secondary label. |  |
| Text background color | The background color behind text. |  |
| Text color | The text in a document. |  |
| Under page background color | The background behind a document’s content. |  |
| Unemphasized selected content background color | The selected content in a non-key window or view. |  |
| Unemphasized selected text background color | A background for selected text in a non-key window or view. |  |
| Unemphasized selected text color | Selected text in a non-key window or view. |  |
| Window background color | The background of a window. |  |
| Window frame text color | The text in the window’s title bar area. |  |

### color — table (13 rows)

| Name | SwiftUI API | Default (light) | Default (dark) | Increased contrast (light) | Increased contrast (dark) |
| Red |  |  |  |  |  |
| Orange |  |  |  |  |  |
| Yellow |  |  |  |  |  |
| Green |  |  |  |  |  |
| Mint |  |  |  |  |  |
| Teal |  |  |  |  |  |
| Cyan |  |  |  |  |  |
| Blue |  |  |  |  |  |
| Indigo |  |  |  |  |  |
| Purple |  |  |  |  |  |
| Pink |  |  |  |  |  |
| Brown |  |  |  |  |  |

### color — table (7 rows)

| Name | UIKit API | Default (light) | Default (dark) | Increased contrast (light) | Increased contrast (dark) |
| Gray |  |  |  |  |  |
| Gray (2) |  |  |  |  |  |
| Gray (3) |  |  |  |  |  |
| Gray (4) |  |  |  |  |  |
| Gray (5) |  |  |  |  |  |
| Gray (6) |  |  |  |  |  |

### color — table (8 rows)

| Date | Changes |
| December 16, 2025 | Updated guidance for Liquid Glass. |
| June 9, 2025 | Updated system color values, and added guidance for Liquid Glass. |
| February 2, 2024 | Distinguished UIKit and SwiftUI gray colors in iOS and iPadOS, and added guidance for balancing brightness levels in visionOS apps. |
| September 12, 2023 | Enhanced guidance for using background color in watchOS views, and added color swatches for tvOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using background color in watchOS. |
| December 19, 2022 | Corrected RGB values for system mint color (Dark Mode) in iOS and iPadOS. |

### complications — table (5 rows)

| Image | 40mm | 41mm | 44mm | 45mm/49mm |
| Image | 42x42 pt (84x84 px @2x) | 44.5x44.5 pt (89x89 px @2x) | 47x47 pt (94x94 px @2x) | 50x50 pt (100x100 px @2x) |
| Closed gauge | 27x27 pt (54x54 px @2x) | 28.5x28.5 pt (57x57 px @2x) | 31x31 pt (62x62 px @2x) | 32x32 pt (64x64 px @2x) |
| Open gauge | 11x11 pt (22x22 px @2x) | 11.5x11.5 pt (23x23 px @2x) | 12x12 pt (24x24 px @2x) | 13x13 pt (26x26 px @2x) |
| Stack (not text) | 28x14 pt (56x28 px @2x) | 29.5x15 pt (59X30 px @2x) | 31x16 pt (62x32px @ 2x) | 33.5x16.5 pt (67x33 px @2x) |

### complications — table (5 rows)

| Image | 40mm | 41mm | 44mm | 45mm/49mm |
| Image | 120x120 pt (240x240 px @2x) | 127x127 pt (254x254 px @2x) | 132x132 pt (264x264 px @2x) | 143x143 pt (286x286 px @2x) |
| Open gauge | 31x31 pt (62x62 px @2x) | 33x33 pt (66x66 px @2x) | 33x33 pt (66x66 px @2x) | 37x37 pt (74x74 px @2x) |
| Closed gauge | 77x77 pt (154x154 px @2x) | 81.5x81.5 (163x163 px @2x) | 87x87 pt (174x174 px @2x) | 91.5x91.5 (183x183 px @2x) |
| Stack | 80x40 pt (160x80 px @2x) | 85x42 (170x84 px @2x) | 87x44 pt (174x88 px @2x) | 95x48 pt (190x96 px @2x ) |

### complications — table (4 rows)

| Layout | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Circular | – | 42x42 pt (84x84 px @2x) | 44.5x44.5 pt (89x89 px @2x) | 47x47 pt (94x94 px @2x) | 50x50 pt (100x100 px @2x) |
| Bezel | – | 42x42 pt (84x84 px @2x) | 44.5x44.5 pt (89x89 px @2x) | 47x47 pt (94x94 px @2x) | 50x50 pt (100x100 px @2x) |
| Extra Large | – | 120x120 pt (240x240 px @2x) | 127x127 pt (254x254 px @2x) | 132x132 pt (264x264 px @2x) | 143x143 pt (286x286 px @2x) |

### complications — table (4 rows)

| Image | 40mm | 41mm | 44mm | 45mm/49mm |
| Circular | 32x32 pt (64x64 px @2x) | 34x34 pt (68x68 px @2x) | 36x36 pt (72x72 px @2x) | 38x38 pt (76x76 px @2x ) |
| Gauge | 20x20 pt (40x40 px @2x) | 21x21 pt (42x42 px @2x) | 22x22 pt (44x44 px @2x) | 24x24 pt (48x48 px @2x) |
| Text | 20x20 pt (40x40 px @2x) | 21x21 pt (42x42 px @2x) | 22x22 pt (44x44 px @2x) | 24x24 pt (48x48 px @2x) |

### complications — table (2 rows)

| 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| – | 20x20 pt (40x40 px @2x) | 21x21 pt (42x42 px @2x) | 22x22 pt (44x44 px @2x) | 24x24 pt (48x48 px @2x) |

### complications — table (4 rows)

| Content | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Flat | 9-21x9 pt (18-42x18 px @2x) | 10-22x10 pt (20-44x20 px @2x) | 10.5-23.5x21 pt (21-47x21 @2x) | N/A | 12-26x12 pt (24-52x24 px @2x) |
| Ring | 14x14 pt (28x28 px @2x) | 14x14 pt (28x28 px @2x) | 15x15 pt (30x30 px @2x) | 16x16 pt (32x32 px @2x) | 16.5x16.5 pt (33x33 px @2x) |
| Square | 20x20 pt (40x40 px @2x) | 22x22 pt (44x44 px @2x) | 23.5x23.5 pt (47x47 px @2x) | 25x25 pt (50x50 px @2x) | 26x26 pt (52x52 px @2x) |

### complications — table (2 rows)

| Content | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Flat | 9-21x9 pt (18-42x18 px @2x) | 10-22x10 pt (20-44x20 px @2x) | 10.5-23.5x10.5 pt (21-47x21 px @2x) | N/A | 12-26x12 pt (24-52x24 px @2x) |

### complications — table (5 rows)

| Content | 40mm | 41mm | 44mm | 45mm/49mm |
| Large image with title * | 150x47 pt (300x94 px @2x) | 159x50 pt (318x100 px @2x) | 171x54 pt (342x108 px @2x) | 178.5x56 pt (357x112 px @2x) |
| Large image without title * | 162x69 pt (324x138 px @2x) | 171.5x73 pt (343x146 px @2x) | 184x78 pt (368x156 px @2x) | 193x82 pt (386x164 px @2x) |
| Standard body | 12x12 pt (24x24 px @2x) | 12.5x12.5 pt (25x25 px @2x) | 13.5x13.5 pt (27x27 px @2x) | 14.5x14.5 pt (29x29 px @2x) |
| Text gauge | 12x12 pt (24x24 px @2x) | 12.5x12.5 pt (25x25 px @2x) | 13.5x13.5 pt (27x27 px @2x) | 14.5x14.5 pt (29x29 px @2x) |

### complications — table (5 rows)

| Image | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Ring | 20x20 pt (40x40 px @2x) | 22x22 pt (44x44 px @2x) | 23.5x23.5 pt (47x47 px @2x) | 24x24 pt (48x48 px @2x) | 26x26 pt (52x52 px @2x) |
| Simple | 16x16 pt (32x32 px @2x) | 18x18 pt (36x36 px @2x) | 19x19 pt (38x38 px @2x) | 20x20 pt (40x40 px @2x) | 21.5x21.5 pt (43x43 px @2x) |
| Stack | 16x7 pt (32x14 px @2x) | 17x8 pt (34x16 px @2x) | 18x8.5 pt (36x17 px @2x) | 19x9 pt (38x18 px @2x) | 19x9.5 pt (38x19 px @2x) |
| Placeholder | 16x16 pt (32x32 px @2x) | 18x18x pt (36x36 px @2x) | 19x19 pt (38x38 px @2x) | 20x20 pt (40x40 px @2x) | 21.5x21.5 pt (43x43 px @2x) |

### complications — table (5 rows)

| Image | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Ring | 18x18 pt (36x36 px @2x) | 19x19 pt (38x38 px @2x) | 20x20 pt (40x40 px @2x) | 21x21 pt (42x42 px @2x) | 22.5x22.5 pt (45x45 px @2x) |
| Simple | 26x26 pt (52x52 px @2x) | 29x29 pt (58x58 px @2x) | 30.5x30.5 pt (61x61 px @2x) | 32x32 pt (64x64 px @2x) | 34.5x34.5 pt (69x69 px @2x) |
| Stack | 26x14 pt (52x28 px @2x) | 29x15 pt (58x30 px @2x) | 30.5x16 pt (61x32 px @2x) | 32x17 pt (64x34 px @2x) | 34.5x18 pt (69x36 px @2x) |
| Placeholder | 26x26 pt (52x52 px @2x) | 29x29 pt (58x58 px @2x) | 30.5x30.5 pt (61x61 px @2x) | 32x32 pt (64x64 px @2x) | 34.5x34.5 pt (69x69 px @2x) |

### complications — table (4 rows)

| Content | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Columns | 11-32x11 pt (22-64x22 px @2x) | 12-37x12 pt (24-74x24 px @2x) | 12.5-39x12.5 pt (25-78x25 px @2x) | 14-42x14 pt (28-84x28 px @2x) | 14.5-44x14.5 pt (29-88x29 px @2x) |
| Standard body | 11-32x11 pt (22-64x22 px @2x) | 12-37x12 pt (24-74x24 px @2x) | 12.5-39x12.5 pt (25-78x25 px @2x) | 14-42x14 pt (28-84x28 px @2x) | 14.5-44x14.5 pt (29-88x29 px @2x) |
| Table | 11-32x11 pt (22-64x22 px @2x) | 12-37x12 pt (24-74x24 px @2x) | 12.5-39x12.5 pt (25-78x25 px @2x) | 14-42x14 pt (28-84x28 px @2x) | 14.5-44x14.5 pt (29-88x29 px @2x) |

### complications — table (5 rows)

| Image | 38mm | 40mm/42mm | 41mm | 44mm | 45mm/49mm |
| Ring | 63x63 pt (126x126 px @2x) | 66.5x66.5 pt (133x133 px @2x) | 70.5x70.5 pt (141x141 px @2x) | 73x73 pt (146x146 px @2x) | 79x79 pt (158x158 px @2x) |
| Simple | 91x91 pt (182x182 px @2x) | 101.5x101.5 pt (203x203 px @2x) | 107.5x107.5 pt (215x215 px @2x) | 112x112 pt (224x224 px @2x) | 121x121 pt (242x242 px @2x ) |
| Stack | 78x42 pt (156x84 px @2x) | 87x45 pt (174x90 px @2x) | 92x47.5 pt (184x95 px @2x) | 96x51 pt (192x102 px @2x) | 103.5x53.5 pt (207x107 px @2x) |
| Placeholder | 91x91 pt (182x182 px @2x) | 101.5x101.5 pt (203x203 px @2x) | 107.5x107.5 pt (215x215 px @2x) | 112x112 pt (224x224 px @2x) | 121x121 pt (242x242 px @2x) |

### complications — table (4 rows)

| Date | Changes |
| October 24, 2023 | Replaced links to deprecated ClockKit documentation with links to WidgetKit documentation. |
| June 5, 2023 | Updated guidance for rectangular complications to support them as widgets in the Smart Stack. |
| September 14, 2022 | Added specifications for Apple Watch Ultra. |

### context-menus — table (4 rows)

| Date | Changes |
| December 5, 2023 | Added guidance on hiding unavailable menu items. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | Refined guidance on including a submenu and added a guideline on using a context menu to support object creation in an iPadOS app. |

### controls — table (2 rows)

| Date | Changes |
| June 10, 2024 | New page. |

### dark-mode — table (2 rows)

| Date | Changes |
| August 6, 2024 | Added art contrasting the light and dark appearances. |

### drag-and-drop — table (3 rows)

| Date | Changes |
| October 24, 2023 | Added artwork. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### edit-menus — table (3 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | Added guidance on supporting both edit-menu styles in iPadOS. |

### entering-data — table (2 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |

### file-management — table (3 rows)

| Date | Changes |
| June 10, 2024 | Added guidelines for using the document launcher in iOS and iPadOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### focus-and-selection — table (6 rows)

| State | Description |
|  | The viewer hasn’t brought focus to the item. Unfocused items appear less prominent than focused items. |
|  | The viewer brings focus to the item. A focused item visually stands out from the other onscreen content through elevation to the foreground, illumination, and animation. |
|  | The viewer chooses the focused item. A focused item provides instant visual feedback when people choose it. For example, a button might briefly invert its colors and animate before it transitions to its selected appearance. |
|  | The viewer has chosen or activated the item in some way. For example, a heart-shaped button that people can use to favorite a photo might appear filled in the selected state and empty in the deselected state. |
|  | The viewer can’t bring focus to the item or choose it. An unavailable item appears inactive. |

### focus-and-selection — table (3 rows)

| Date | Changes |
| October 24, 2023 | Clarified the difference between focus effects and the visionOS hover effect. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### gauges — table (2 rows)

| Date | Changes |
| September 23, 2022 | New page. |

### gestures — table (5 rows)

| Gesture | Common action |
| Three-finger swipe | Initiate undo (left swipe); initiate redo (right swipe). |
| Three-finger pinch | Copy selected text (pinch in); paste copied text (pinch out). |
| Four-finger swipe (iPadOS only) | Switch between apps. |
| Shake | Initiate undo; initiate redo. |

### gestures — table (8 rows)

| Direct gesture | Common use |
| Touch | Directly select or activate an object. |
| Touch and hold | Open a contextual menu. |
| Touch and drag | Move an object to a new location. |
| Double touch | Preview an object or file; select a word in an editing context. |
| Swipe | Reveal actions and controls; dismiss views; scroll. |
| With two hands, pinch and drag together or apart | Zoom in or out. |
| With two hands, pinch and drag in a circular motion | Rotate an object. |

### gestures — table (8 rows)

| Gesture | Supported in | Common action |
| Tap | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | Activate a control; select an item. |
| Swipe | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | Reveal actions and controls; dismiss views; scroll. |
| Drag | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | Move a UI element. |
| Touch (or pinch) and hold | iOS, iPadOS, tvOS, visionOS, watchOS | Reveal additional controls or functionality. |
| Double tap | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | Zoom in; zoom out if already zoomed in; perform a primary action on Apple Watch Series 9 and Apple Watch Ultra 2. |
| Zoom | iOS, iPadOS, macOS, tvOS, visionOS | Zoom a view; magnify content. |
| Rotate | iOS, iPadOS, macOS, tvOS, visionOS | Rotate a selected item. |

### gestures — table (4 rows)

| Date | Changes |
| September 9, 2024 | Added guidance for working with system overlays in visionOS and made organizational updates. |
| September 15, 2023 | Updated specifications to include double tap in watchOS. |
| June 21, 2023 | Changed page title from Touchscreen gestures and updated to include guidance for visionOS. |

### icons — table (19 rows)

| Action | Icon | Symbol name |
| Cut |  | scissors |
| Copy |  | document.on.document |
| Paste |  | document.on.clipboard |
| Done |  | checkmark |
| Save |  |  |
| Cancel |  | xmark |
| Close |  |  |
| Delete |  | trash |
| Undo |  | arrow.uturn.backward |
| Redo |  | arrow.uturn.forward |
| Compose |  | square.and.pencil |
| Duplicate |  | plus.square.on.square |
| Rename |  | pencil |
| Move to |  | folder |
| Folder |  |  |
| Attach |  | paperclip |
| Add |  | plus |
| More |  | ellipsis |

### icons — table (5 rows)

| Action | Icon | Symbol name |
| Select |  | checkmark.circle |
| Deselect |  | xmark |
| Close |  |  |
| Delete |  | trash |

### icons — table (10 rows)

| Action | Icon | Symbol name |
| Superscript |  | textformat.superscript |
| Subscript |  | textformat.subscript |
| Bold |  | bold |
| Italic |  | italic |
| Underline |  | underline |
| ​​Align Left |  | text.alignleft |
| Center |  | text.aligncenter |
| Justified |  | text.justify |
| Align Right |  | text.alignright |

### icons — table (8 rows)

| Action | Icon | Symbol name |
| Search |  | magnifyingglass |
| Find |  | text.page.badge.magnifyingglass |
| Find and Replace |  |  |
| Find Next |  |  |
| Find Previous |  |  |
| Use Selection for Find |  |  |
| Filter |  | line.3.horizontal.decrease |

### icons — table (4 rows)

| Action | Icon | Symbol name |
| Share |  | square.and.arrow.up |
| Export |  |  |
| Print |  | printer |

### icons — table (4 rows)

| Action | Icon | Symbol name |
| Account |  | person.crop.circle |
| User |  |  |
| Profile |  |  |

### icons — table (3 rows)

| Action | Icon | Symbol name |
| Dislike |  | hand.thumbsdown |
| Like |  | hand.thumbsup |

### icons — table (5 rows)

| Action | Icon | Symbol name |
| Bring to Front |  | square.3.layers.3d.top.filled |
| Send to Back |  | square.3.layers.3d.bottom.filled |
| Bring Forward |  | square.2.layers.3d.top.filled |
| Send Backward |  | square.2.layers.3d.bottom.filled |

### icons — table (4 rows)

| Action | Icon | Symbol name |
| Alarm |  | alarm |
| Archive |  | archivebox |
| Calendar |  | calendar |

### icons — table (3 rows)

| Date | Changes |
| June 9, 2025 | Added a table of SF Symbols that represent common actions. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### image-views — table (2 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |

### images — table (5 rows)

| Platform | Scale factors |
| iPadOS, watchOS | @2x |
| iOS | @2x and @3x |
| visionOS | @2x or higher (see ) |
| macOS, tvOS | @1x and @2x |

### images — table (6 rows)

| Image type | Format |
| Bitmap or raster work | De-interlaced PNG files |
| PNG graphics that don’t require full 24-bit color | An 8-bit color palette |
| Photos | JPEG files, optimized as necessary, or HEIC files |
| Stereo or spatial photos | Stereo HEIC |
| Flat icons, interface icons, and other flat artwork that requires high-resolution scaling | PDF or SVG files |

### images — table (8 rows)

| Screen size | Image scale |
| 38mm | 90% |
| 40mm | 100% |
| 41mm | 106% |
| 42mm | 100% |
| 44mm | 110% |
| 45mm | 119% |
| 49mm | 119% |

### images — table (5 rows)

| Date | Changes |
| December 16, 2025 | Added guidance for spatial photos and spatial scenes in visionOS. |
| December 5, 2023 | Clarified guidance on choosing a resolution for a rasterized image in a visionOS app. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | Added specifications for Apple Watch Ultra. |

### keyboards — table (117 rows)

| Primary key | Keyboard shortcut | Action |
| Space | Command-Space | Show or hide the Spotlight search field. |
|  | Shift-Command-Space | Varies. |
|  | Option-Command-Space | Show the Spotlight search results window. |
|  | Control-Command-Space | Show the Special Characters window. |
| Tab | Shift-Tab | Navigate through controls in a reverse direction. |
|  | Command-Tab | Move forward to the next most recently used app in a list of open apps. |
|  | Shift-Command-Tab | Move backward through a list of open apps (sorted by recent use). |
|  | Control-Tab | Move focus to the next group of controls in a dialog or the next table (when Tab moves to the next cell). |
|  | Control-Shift-Tab | Move focus to the previous group of controls. |
| Esc | Esc | Cancel the current action or process. |
| Esc | Option-Command-Esc | Open the Force Quit dialog. |
| Eject | Control-Command-Eject | Quit all apps (after changes have been saved to open documents) and restart the computer. |
|  | Control-Option-Command-Eject | Quit all apps (after changes have been saved to open documents) and shut the computer down. |
| F1 | Control-F1 | Toggle full keyboard access on or off. |
| F2 | Control-F2 | Move focus to the menu bar. |
| F3 | Control- F3 | Move focus to the Dock. |
| F4 | Control-F4 | Move focus to the active (or next) window. |
|  | Control-Shift-F4 | Move focus to the previously active window. |
| F5 | Control-F5 | Move focus to the toolbar. |
|  | Command-F5 | Turn VoiceOver on or off. |
| F6 | Control-F6 | Move focus to the first (or next) panel. |
|  | Control-Shift-F6 | Move focus to the previous panel. |
| F7 | Control-F7 | Temporarily override the current keyboard access mode in windows and dialogs. |
| F8 |  | Varies. |
| F9 |  | Varies. |
| F10 |  | Varies. |
| F11 |  | Show desktop. |
| F12 |  | Hide or display Dashboard. |
| Grave accent (`) | Command-Grave accent | Activate the next open window in the frontmost app. |
|  | Shift-Command-Grave accent | Activate the previous open window in the frontmost app. |
|  | Option-Command-Grave accent | Move focus to the window drawer. |
| Hyphen (-) | Command-Hyphen | Decrease the size of the selection. |
|  | Option-Command-Hyphen | Zoom out when screen zooming is on. |
| Left bracket ({) | Command-Left bracket | Left-align a selection. |
| Right bracket (}) | Command-Right bracket | Right-align a selection. |
| Pipe (|) | Command-Pipe | Center-align a selection. |
| Colon (:) | Command-Colon | Display the Spelling window. |
| Semicolon (;) | Command-Semicolon | Find misspelled words in the document. |
| Comma (,) | Command-Comma | Open the app’s settings window. |
|  | Control-Option-Command-Comma | Decrease screen contrast. |
| Period (.) | Command-Period | Cancel an operation. |
|  | Control-Option-Command-Period | Increase screen contrast. |
| Question mark (?) | Command-Question mark | Open the app’s Help menu. |
| Forward slash (/) | Option-Command-Forward slash | Turn font smoothing on or off. |
| Equal sign (=) | Shift-Command-Equal sign | Increase the size of the selection. |
|  | Option-Command-Equal sign | Zoom in when screen zooming is on. |
| 3 | Shift-Command-3 | Capture the screen to a file. |
|  | Control-Shift-Command-3 | Capture the screen to the Clipboard. |
| 4 | Shift-Command-4 | Capture a selection to a file. |
|  | Control-Shift-Command-4 | Capture a selection to the Clipboard. |
| 8 | Option-Command-8 | Turn screen zooming on or off. |
|  | Control-Option-Command-8 | Invert the screen colors. |
| A | Command-A | Select every item in a document or window, or all characters in a text field. |
|  | Shift-Command-A | Deselect all selections or characters. |
| B | Command-B | Boldface the selected text or toggle boldfaced text on and off. |
| C | Command-C | Copy the selection to the Clipboard. |
|  | Shift-Command-C | Display the Colors window. |
|  | Option-Command-C | Copy the style of the selected text. |
|  | Control-Command-C | Copy the formatting settings of the selection and store on the Clipboard. |
| D | Option-Command-D | Show or hide the Dock. |
|  | Control-Command-D | Display the definition of the selected word in the Dictionary app. |
| E | Command-E | Use the selection for a find operation. |
| F | Command-F | Open a Find window. |
|  | Option-Command-F | Jump to the search field control. |
|  | Control-Command-F | Enter full screen. |
| G | Command-G | Find the next occurrence of the selection. |
|  | Shift-Command-G | Find the previous occurrence of the selection. |
| H | Command-H | Hide the windows of the currently running app. |
|  | Option-Command-H | Hide the windows of all other running apps. |
| I | Command-I | Italicize the selected text or toggle italic text on or off. |
|  | Command-I | Display an Info window. |
|  | Option-Command-I | Display an inspector window. |
| J | Command-J | Scroll to a selection. |
| M | Command-M | Minimize the active window to the Dock. |
|  | Option-Command-M | Minimize all windows of the active app to the Dock. |
| N | Command-N | Open a new document. |
| O | Command-O | Display a dialog for choosing a document to open. |
| P | Command-P | Display the Print dialog. |
|  | Shift-Command-P | Display the Page Setup dialog. |
| Q | Command-Q | Quit the app. |
|  | Shift-Command-Q | Log out the person currently logged in. |
|  | Option-Shift-Command-Q | Log out the person currently logged in without confirmation. |
| S | Command-S | Save a new document or save a version of a document. |
|  | Shift-Command-S | Duplicate the active document or initiate a Save As. |
| T | Command-T | Display the Fonts window. |
|  | Option-Command-T | Show or hide a toolbar. |
| U | Command-U | Underline the selected text or turn underlining on or off. |
| V | Command-V | Paste the Clipboard contents at the insertion point. |
|  | Shift-Command-V | Paste as (Paste as Quotation, for example). |
|  | Option-Command-V | Apply the style of one object to the selection. |
|  | Option-Shift-Command-V | Paste the Clipboard contents at the insertion point and apply the style of the surrounding text to the inserted object. |
|  | Control-Command-V | Apply formatting settings to the selection. |
| W | Command-W | Close the active window. |
|  | Shift-Command-W | Close a file and its associated windows. |
|  | Option-Command-W | Close all windows in the app. |
| X | Command-X | Remove the selection and store on the Clipboard. |
| Z | Command-Z | Undo the previous operation. |
|  | Shift-Command-Z | Redo (when Undo and Redo are separate commands rather than toggled using Command-Z). |
| Right arrow | Command-Right arrow | Change the keyboard layout to current layout of Roman script. |
|  | Shift-Command-Right arrow | Extend selection to the next semantic unit, typically the end of the current line. |
|  | Shift-Right arrow | Extend selection one character to the right. |
|  | Option-Shift-Right arrow | Extend selection to the end of the current word, then to the end of the next word. |
|  | Control-Right arrow | Move focus to another value or cell within a view, such as a table. |
| Left arrow | Command-Left arrow | Change the keyboard layout to current layout of system script. |
|  | Shift-Command-Left arrow | Extend selection to the previous semantic unit, typically the beginning of the current line. |
|  | Shift-Left arrow | Extend selection one character to the left. |
|  | Option-Shift-Left arrow | Extend selection to the beginning of the current word, then to the beginning of the previous word. |
|  | Control-Left arrow | Move focus to another value or cell within a view, such as a table. |
| Up arrow | Shift-Command-Up arrow | Extend selection upward in the next semantic unit, typically the beginning of the document. |
|  | Shift-Up arrow | Extend selection to the line above, to the nearest character boundary at the same horizontal location. |
|  | Option-Shift-Up arrow | Extend selection to the beginning of the current paragraph, then to the beginning of the next paragraph. |
|  | Control-Up arrow | Move focus to another value or cell within a view, such as a table. |
| Down arrow | Shift-Command-Down arrow | Extend selection downward in the next semantic unit, typically the end of the document. |
|  | Shift-Down arrow | Extend selection to the line below, to the nearest character boundary at the same horizontal location. |
|  | Option-Shift-Down arrow | Extend selection to the end of the current paragraph, then to the end of the next paragraph (include the paragraph terminator, such as Return, in cut, copy, and paste operations). |
|  | Control-Down arrow | Move focus to another value or cell within a view, such as a table. |

### keyboards — table (6 rows)

| Keyboard shortcut | Action |
| Control-Space | Toggle between the current and last input source. |
| Control-Option-Space | Switch to the next input source in the list. |
| [Modifier key]-Command-Space | Varies. |
| Command-Right arrow | Change keyboard layout to current layout of Roman script. |
| Command-Left arrow | Change keyboard layout to current layout of system script. |

### keyboards — table (5 rows)

| Modifier key | Symbol | Recommended usage |
| Command |  | Prefer the Command key as the main modifier key in a custom keyboard shortcut. |
| Shift |  | Prefer the Shift key as a secondary modifier that complements a related shortcut. |
| Option |  | Use the Option modifier sparingly for less-common commands or power features. |
| Control |  | Avoid using the Control key as a modifier. The system uses Control in many systemwide features and shortcuts, like moving focus or capturing screenshots. |

### keyboards — table (4 rows)

| Date | Changes |
| June 9, 2025 | Moved game-specific key bindings guidance to the Game controls page. |
| June 10, 2024 | Added game-specific guidance and made organizational updates. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### labels — table (5 rows)

| System color | Example usage | iOS, iPadOS, tvOS, visionOS | macOS |
| Label | Primary information |  |  |
| Secondary label | A subheading or supplemental text |  |  |
| Tertiary label | Text that describes an unavailable item or behavior |  |  |
| Quaternary label | Watermark text |  |  |

### labels — table (2 rows)

| Date | Changes |
| June 5, 2023 | Updated guidance to reflect changes in watchOS 10. |

### launching — table (3 rows)

| Date | Changes |
| June 10, 2024 | Added guidance on displaying a splash screen. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### layout — table (60 rows)

| Model | Dimensions (portrait) |
| iPad Pro 13-inch | 1032x1376 pt (2064x2752 px @2x) |
| iPad Pro 12.9-inch | 1024x1366 pt (2048x2732 px @2x) |
| iPad Pro 11-inch 5th and 6th generation | 834x1210 pt (1668x2420 px @2x) |
| iPad Pro 11-inch 1st–4th generation | 834x1194 pt (1668x2388 px @2x) |
| iPad Pro 10.5-inch | 834x1112 pt (1668x2224 px @2x) |
| iPad Pro 9.7-inch | 768x1024 pt (1536x2048 px @2x) |
| iPad Air 13-inch | 1024x1366 pt (2048x2732 px @2x) |
| iPad Air 11-inch | 820x1180 pt (1640x2360 px @2x) |
| iPad Air 10.9-inch | 820x1180 pt (1640x2360 px @2x) |
| iPad Air 10.5-inch | 834x1112 pt (1668x2224 px @2x) |
| iPad Air 9.7-inch | 768x1024 pt (1536x2048 px @2x) |
| iPad 11-inch | 820x1180 pt (1640x2360 px @2x) |
| iPad 10.2-inch | 810x1080 pt (1620x2160 px @2x) |
| iPad 9.7-inch | 768x1024 pt (1536x2048 px @2x) |
| iPad mini 8.3-inch | 744x1133 pt (1488x2266 px @2x) |
| iPad mini 7.9-inch | 768x1024 pt (1536x2048 px @2x) |
| iPhone 17 Pro Max | 440x956 pt (1320x2868 px @3x) |
| iPhone 17 Pro | 402x874 pt (1206x2622 px @3x) |
| iPhone Air | 420x912 pt (1260x2736 px @3x) |
| iPhone 17 | 402x874 pt (1206x2622 px @3x) |
| iPhone 16 Pro Max | 440x956 pt (1320x2868 px @3x) |
| iPhone 16 Pro | 402x874 pt (1206x2622 px @3x) |
| iPhone 16 Plus | 430x932 pt (1290x2796 px @3x) |
| iPhone 16 | 393x852 pt (1179x2556 px @3x) |
| iPhone 16e | 390x844 pt (1170x2532 px @3x) |
| iPhone 15 Pro Max | 430x932 pt (1290x2796 px @3x) |
| iPhone 15 Pro | 393x852 pt (1179x2556 px @3x) |
| iPhone 15 Plus | 430x932 pt (1290x2796 px @3x) |
| iPhone 15 | 393x852 pt (1179x2556 px @3x) |
| iPhone 14 Pro Max | 430x932 pt (1290x2796 px @3x) |
| iPhone 14 Pro | 393x852 pt (1179x2556 px @3x) |
| iPhone 14 Plus | 428x926 pt (1284x2778 px @3x) |
| iPhone 14 | 390x844 pt (1170x2532 px @3x) |
| iPhone 13 Pro Max | 428x926 pt (1284x2778 px @3x) |
| iPhone 13 Pro | 390x844 pt (1170x2532 px @3x) |
| iPhone 13 | 390x844 pt (1170x2532 px @3x) |
| iPhone 13 mini | 360x780 pt (1080x2340 px @3x) |
| iPhone 12 Pro Max | 428x926 pt (1284x2778 px @3x) |
| iPhone 12 Pro | 390x844 pt (1170x2532 px @3x) |
| iPhone 12 | 390x844 pt (1170x2532 px @3x) |
| iPhone 12 mini | 360x780 pt (1080x2340 px @3x) |
| iPhone 11 Pro Max | 414x896 pt (1242x2688 px @3x) |
| iPhone 11 Pro | 375x812 pt (1125x2436 px @3x) |
| iPhone 11 | 414x896 pt (828x1792 px @2x) |
| iPhone XS Max | 414x896 pt (1242x2688 px @3x) |
| iPhone XS | 375x812 pt (1125x2436 px @3x) |
| iPhone XR | 414x896 pt (828x1792 px @2x) |
| iPhone X | 375x812 pt (1125x2436 px @3x) |
| iPhone 8 Plus | 414x736 pt (1080x1920 px @3x) |
| iPhone 8 | 375x667 pt (750x1334 px @2x) |
| iPhone 7 Plus | 414x736 pt (1080x1920 px @3x) |
| iPhone 7 | 375x667 pt (750x1334 px @2x) |
| iPhone 6s Plus | 414x736 pt (1080x1920 px @3x) |
| iPhone 6s | 375x667 pt (750x1334 px @2x) |
| iPhone 6 Plus | 414x736 pt (1080x1920 px @3x) |
| iPhone 6 | 375x667 pt (750x1334 px @2x) |
| iPhone SE 4.7-inch | 375x667 pt (750x1334 px @2x) |
| iPhone SE 4-inch | 320x568 pt (640x1136 px @2x) |
| iPod touch 5th generation and later | 320x568 pt (640x1136 px @2x) |

### layout — table (49 rows)

| Model | Portrait orientation | Landscape orientation |
| iPad Pro 12.9-inch | Regular width, regular height | Regular width, regular height |
| iPad Pro 11-inch | Regular width, regular height | Regular width, regular height |
| iPad Pro 10.5-inch | Regular width, regular height | Regular width, regular height |
| iPad Air 13-inch | Regular width, regular height | Regular width, regular height |
| iPad Air 11-inch | Regular width, regular height | Regular width, regular height |
| iPad 11-inch | Regular width, regular height | Regular width, regular height |
| iPad 9.7-inch | Regular width, regular height | Regular width, regular height |
| iPad mini 7.9-inch | Regular width, regular height | Regular width, regular height |
| iPhone 17 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 17 Pro | Compact width, regular height | Compact width, compact height |
| iPhone Air | Compact width, regular height | Regular width, compact height |
| iPhone 17 | Compact width, regular height | Compact width, compact height |
| iPhone 16 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 16 Pro | Compact width, regular height | Compact width, compact height |
| iPhone 16 Plus | Compact width, regular height | Regular width, compact height |
| iPhone 16 | Compact width, regular height | Compact width, compact height |
| iPhone 16e | Compact width, regular height | Compact width, compact height |
| iPhone 15 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 15 Pro | Compact width, regular height | Compact width, compact height |
| iPhone 15 Plus | Compact width, regular height | Regular width, compact height |
| iPhone 15 | Compact width, regular height | Compact width, compact height |
| iPhone 14 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 14 Pro | Compact width, regular height | Compact width, compact height |
| iPhone 14 Plus | Compact width, regular height | Regular width, compact height |
| iPhone 14 | Compact width, regular height | Compact width, compact height |
| iPhone 13 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 13 Pro | Compact width, regular height | Compact width, compact height |
| iPhone 13 | Compact width, regular height | Compact width, compact height |
| iPhone 13 mini | Compact width, regular height | Compact width, compact height |
| iPhone 12 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 12 Pro | Compact width, regular height | Compact width, compact height |
| iPhone 12 | Compact width, regular height | Compact width, compact height |
| iPhone 12 mini | Compact width, regular height | Compact width, compact height |
| iPhone 11 Pro Max | Compact width, regular height | Regular width, compact height |
| iPhone 11 Pro | Compact width, regular height | Compact width, compact height |
| iPhone 11 | Compact width, regular height | Regular width, compact height |
| iPhone XS Max | Compact width, regular height | Regular width, compact height |
| iPhone XS | Compact width, regular height | Compact width, compact height |
| iPhone XR | Compact width, regular height | Regular width, compact height |
| iPhone X | Compact width, regular height | Compact width, compact height |
| iPhone 8 Plus | Compact width, regular height | Regular width, compact height |
| iPhone 8 | Compact width, regular height | Compact width, compact height |
| iPhone 7 Plus | Compact width, regular height | Regular width, compact height |
| iPhone 7 | Compact width, regular height | Compact width, compact height |
| iPhone 6s Plus | Compact width, regular height | Regular width, compact height |
| iPhone 6s | Compact width, regular height | Compact width, compact height |
| iPhone SE | Compact width, regular height | Compact width, compact height |
| iPod touch 5th generation and later | Compact width, regular height | Compact width, compact height |

### layout — table (11 rows)

| Series | Size | Width (pixels) | Height (pixels) |
| Apple Watch Ultra (3rd generation) | 49mm | 422 | 514 |
| 10, 11 | 42mm | 374 | 446 |
| 10, 11 | 46mm | 416 | 496 |
| Apple Watch Ultra (1st and 2nd generations) | 49mm | 410 | 502 |
| 7, 8, and 9 | 41mm | 352 | 430 |
| 7, 8, and 9 | 45mm | 396 | 484 |
| 4, 5, 6, and SE (all generations) | 40mm | 324 | 394 |
| 4, 5, 6, and SE (all generations) | 44mm | 368 | 448 |
| 1, 2, and 3 | 38mm | 272 | 340 |
| 1, 2, and 3 | 42mm | 312 | 390 |

### layout — table (11 rows)

| Date | Changes |
| September 9, 2025 | Added specifications for iPhone 17, iPhone Air, iPhone 17 Pro, iPhone 17 Pro Max, Apple Watch SE 3, Apple Watch Series 11, and Apple Watch Ultra 3. |
| June 9, 2025 | Added guidance for Liquid Glass. |
| March 7, 2025 | Added specifications for iPhone 16e, iPad 11-inch, iPad Air 11-inch, and iPad Air 13-inch. |
| September 9, 2024 | Added specifications for iPhone 16, iPhone 16 Plus, iPhone 16 Pro, iPhone 16 Pro Max, and Apple Watch Series 10. |
| June 10, 2024 | Made minor corrections and organizational updates. |
| February 2, 2024 | Enhanced guidance for avoiding system controls in iPadOS app layouts, and added specifications for 10.9-inch iPad Air and 8.3-inch iPad mini. |
| December 5, 2023 | Clarified guidance on centering content in a visionOS window. |
| September 15, 2023 | Added specifications for iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus, iPhone 15, Apple Watch Ultra 2, and Apple Watch SE. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | Added specifications for iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14, and Apple Watch Ultra. |

### lists-and-tables — table (3 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance to reflect changes in watchOS 10. |

### live-activities — table (5 rows)

| Platform or system experience | Location |
| iPhone and iPad | Lock Screen, Home Screen, in the Dynamic Island and StandBy on iPhone |
| Mac | The menu bar |
| Apple Watch | Smart Stack |
| CarPlay | CarPlay Dashboard |

### live-activities — table (4 rows)

| Live Activity size (pt) |
| 240x78 |
| 240x100 |
| 170x78 |

### live-activities — table (4 rows)

| Configuration | Resolution (pt) |
| Widescreen | 1920x720 |
| Portrait | 900x1200 |
| Standard | 800x480 |

### live-activities — table (3 rows)

| Screen dimensions (portrait) | Compact leading | Compact trailing | Minimal (width given as a range) | Expanded (height given as a range) | Lock Screen (height given as a range) |
| 430x932 | 62.33x36.67 | 62.33x36.67 | 36.67–45x36.67 | 408x84–160 | 408x84–160 |
| 393x852 | 52.33x36.67 | 52.33x36.67 | 36.67–45x36.67 | 371x84–160 | 371x84–160 |

### live-activities — table (29 rows)

| Presentation type | Device | Dynamic Island width (pt) |
| Compact or minimal | iPhone 17 Pro Max | 250 |
|  | iPhone 17 Pro | 230 |
|  | iPhone Air | 250 |
|  | iPhone 17 | 230 |
|  | iPhone 16 Pro Max | 250 |
|  | iPhone 16 Pro | 230 |
|  | iPhone 16 Plus | 250 |
|  | iPhone 16 | 230 |
|  | iPhone 15 Pro Max | 250 |
|  | iPhone 15 Pro | 230 |
|  | iPhone 15 Plus | 250 |
|  | iPhone 15 | 230 |
|  | iPhone 14 Pro Max | 250 |
|  | iPhone 14 Pro | 230 |
| Expanded | iPhone 17 Pro Max | 408 |
|  | iPhone 17 Pro | 371 |
|  | iPhone Air | 408 |
|  | iPhone 17 | 371 |
|  | iPhone 16 Pro Max | 408 |
|  | iPhone 16 Pro | 371 |
|  | iPhone 16 Plus | 408 |
|  | iPhone 16 | 371 |
|  | iPhone 15 Pro Max | 408 |
|  | iPhone 15 Pro | 371 |
|  | iPhone 15 Plus | 408 |
|  | iPhone 15 | 371 |
|  | iPhone 14 Pro Max | 408 |
|  | iPhone 14 Pro | 371 |

### live-activities — table (6 rows)

| Screen dimensions (portrait) | Lock Screen (height given as a range) |
| 1366x1024 | 500x84–160 |
| 1194x834 | 425x84–160 |
| 1012x834 | 425x84–160 |
| 1080x810 | 425x84–160 |
| 1024x768 | 425x84–160 |

### live-activities — table (6 rows)

| Apple Watch size | Size of a Live Activity in the Smart Stack (pt) |
| 40mm | 152x69.5 |
| 41mm | 165x72.5 |
| 44mm | 173x76.5 |
| 45mm | 184x80.5 |
| 49mm | 191x81.5 |

### live-activities — table (7 rows)

| Date | Changes |
| December 16, 2025 | Updated guidance for all platforms, and added guidance for macOS and CarPlay. |
| June 10, 2024 | Added guidance for Live Activities in watchOS. |
| October 24, 2023 | Expanded and updated guidance and added new artwork. |
| June 5, 2023 | Updated guidance to include features of iOS 17 and iPadOS 17. |
| November 3, 2022 | Updated artwork and specifications. |
| September 23, 2022 | New page. |

### loading — table (3 rows)

| Date | Changes |
| June 9, 2025 | Revised guidance for storing downloads to reflect downloading large assets in the background. |
| June 10, 2024 | Added guidelines for showing progress and storing downloads, and enhanced guidance for games. |

### managing-notifications — table (5 rows)

| Interruption level | Overrides scheduled delivery | Breaks through Focus | Overrides Ring/Silent switch on iPhone and iPad |
| Passive | No | No | No |
| Active | No | No | No |
| Time Sensitive | Yes | Yes | No |
| Critical | Yes | Yes | Yes |

### materials — table (5 rows)

| Material | Recommended for |
|  | Full-screen views that require a light color scheme |
|  | Overlay views that partially obscure onscreen content and require a light color scheme |
|  | Overlay views that partially obscure onscreen content |
|  | Overlay views that partially obscure onscreen content and require a dark color scheme |

### materials — table (7 rows)

| Date | Changes |
| September 9, 2025 | Updated guidance for Liquid Glass. |
| June 9, 2025 | Added guidance for Liquid Glass. |
| August 6, 2024 | Added platform-specific art. |
| December 5, 2023 | Updated descriptions of the various material types, and clarified terms related to vibrancy and material thickness. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Added guidance on using materials to provide context and orientation in watchOS apps. |

### menus — table (7 rows)

| Date | Changes |
| June 8, 2026 | Updated guidance for menu item icons. |
| December 16, 2025 | Added guidance for presenting menus with breakthrough effects in visionOS. |
| July 28, 2025 | Added guidance for representing menu items with icons. |
| June 10, 2024 | Added guidance for in-game menus and included game-specific examples. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| September 14, 2022 | Added guidelines for using the small, medium, and large menu layouts in iPadOS. |

### modality — table (3 rows)

| Date | Changes |
| December 5, 2023 | Enhanced guidance for in-depth modal experiences and clarified guidance on multiple modal views. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### motion — table (5 rows)

| Date | Changes |
| September 9, 2025 | Added guidance for Liquid Glass. |
| June 10, 2024 | Added game-specific examples and enhanced guidance for using motion in games. |
| February 2, 2024 | Enhanced guidance for minimizing peripheral motion in visionOS apps. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### multitasking — table (4 rows)

| Date | Changes |
| June 9, 2025 | Reorganized guidance in platform considerations, and added guidance for multitasking with multiple windows in iPadOS. |
| December 5, 2023 | Added artwork for primary and auxiliary windows in iPadOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### notifications — table (2 rows)

| Date | Changes |
| October 24, 2023 | Updated watchOS platform considerations with guidance for presenting notification responses to double tap. |

### offering-help — table (3 rows)

| Date | Changes |
| December 5, 2023 | Included visionOS in guidance for creating tooltips. |
| September 12, 2023 | Added guidance for creating tips. |

### onboarding — table (3 rows)

| Date | Changes |
| June 10, 2024 | Clarified different approaches to onboarding and added a guideline on displaying a splash screen. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### ornaments — table (4 rows)

| Date | Changes |
| February 2, 2024 | Added guidance on using multiple ornaments. |
| December 5, 2023 | Removed a statement about using ornaments to present supplementary items. |
| June 21, 2023 | New page. |

### page-controls — table (3 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using page controls in watchOS. |

### pickers — table (2 rows)

| Date | Changes |
| June 5, 2023 | Updated guidance for using pickers in watchOS. |

### pointing-devices — table (17 rows)

| Click or gesture | Expected behavior | Mouse | Trackpad |
| Primary click | Select or activate an item, such as a file or button. | ● | ● |
| Secondary click | Reveal contextual menus. | ● | ● |
| Scrolling | Move content up, down, left, or right within a view. | ● | ● |
| Smart zoom | Zoom in or out on content, such as a web page or PDF. | ● | ● |
| Swipe between pages | Navigate forward or backward between individually displayed pages. | ● | ● |
| Swipe between full-screen apps | Navigate forward or backward between full-screen apps and spaces. | ● | ● |
| Mission Control (double-tap the mouse with two fingers or swipe up on the trackpad with three or four fingers) | Activate Mission Control. | ● | ● |
| Lookup and data detectors (force click with one finger or tap with three fingers) | Display a lookup window above selected content. |  | ● |
| Tap to click | Perform the primary click action using a tap rather than a click. |  | ● |
| Force click | Click then press firmly to display a Quick Look window or lookup window above selected content. Apply a variable amount of pressure to affect pressure-sensitive controls, such as variable speed media controls. |  | ● |
| Zoom in or out (pinch with two fingers) | Zoom in or out. |  | ● |
| Rotate (move two fingers in a circular motion) | Rotate content, such as an image. |  | ● |
| Notification Center (swipe from the edge of the trackpad) | Display Notification Center. |  | ● |
| App Exposé (swipe down with three or four fingers) | Display the current app’s windows in Exposé. |  | ● |
| Launchpad (pinch with thumb and three fingers) | Display the Launchpad. |  | ● |
| Show Desktop (spread with thumb and three fingers) | Slide all windows out of the way to reveal the desktop. |  | ● |

### pointing-devices — table (19 rows)

| Pointer | Name | Meaning | AppKit API |
|  | Arrow | Standard pointer for selecting and interacting with content and interface elements. |  |
|  | Closed hand | Dragging to reposition the display of content within a view—for example, dragging a map around in Maps. |  |
|  | Contextual menu | A contextual menu is available for the content below the pointer. This pointer is generally shown only when the Control key is pressed. |  |
|  | Crosshair | Precise rectangular selection is possible, such as when viewing an image in Preview. |  |
|  | Disappearing item | A dragged item will disappear when dropped. If the item references an original item, the original is unaffected. For example, when dragging a mailbox out of the favorites bar in Mail, the original mailbox isn’t removed. |  |
|  | Drag copy | Duplicates a dragged—not moved—item when dropped into the destination. Appears when pressing the Option key during a drag operation. |  |
|  | Drag link | During a drag and drop operation, creates an alias of the selected file when dropped. The alias points to the original file, which remains unmoved. Appears when pressing the Option and Command keys during a drag operation. |  |
|  | Horizontal I beam | Selection and insertion of text is possible in a horizontal layout, such as a TextEdit or Pages document. |  |
|  | Open hand | Dragging to reposition content within a view is possible. |  |
|  | Operation not allowed | A dragged item can’t be dropped in the current location. |  |
|  | Pointing hand | The content beneath the pointer is a URL link to a webpage, document, or other item. |  |
|  | Resize down | Resize or move a window, view, or element downward. |  |
|  | Resize left | Resize or move a window, view, or element to the left. |  |
|  | Resize left/right | Resize or move a window, view, or element to the left or right. |  |
|  | Resize right | Resize or move a window, view, or element to the right. |  |
|  | Resize up | Resize or move a window, view, or element upward. |  |
|  | Resize up/down | Resize or move a window, view, or element upward or downward. |  |
|  | Vertical I beam | Selection and insertion of text is possible in a vertical layout. |  |

### pointing-devices — table (2 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |

### pop-up-buttons — table (3 rows)

| Date | Changes |
| October 24, 2023 | Added artwork. |
| September 14, 2022 | Added a guideline on using a pop-up button in a popover or modal view in iPadOS. |

### privacy — table (4 rows)

|  | Example purpose string | Notes |
|  | The app records during the night to detect snoring sounds. | An active sentence that clearly describes how and why the app collects the data. |
|  | Microphone access is needed for a better experience. | A passive sentence that provides a vague, undefined justification. |
|  | Turn on microphone access. | An imperative sentence that doesn’t provide any justification. |

### privacy — table (2 rows)

| Date | Changes |
| June 21, 2023 | Consolidated guidance into new page and updated for visionOS. |

### progress-indicators — table (3 rows)

| Date | Changes |
| September 12, 2023 | Combined guidance common to all platforms. |
| June 5, 2023 | Updated guidance to reflect changes in watchOS 10. |

### pull-down-buttons — table (2 rows)

| Date | Changes |
| September 14, 2022 | Refined guidance on designing a useful menu length. |

### rating-indicators — table (2 rows)

| Date | Changes |
| September 23, 2022 | New page. |

### scroll-views — table (7 rows)

| Date | Changes |
| June 8, 2026 | Updated guidance for scroll edge effects. |
| March 24, 2026 | Added guidance for Look to Scroll in visionOS. |
| July 28, 2025 | Added guidance for scroll edge effects. |
| February 2, 2024 | Added artwork showing the behavior of the visionOS scroll indicator. |
| December 5, 2023 | Described the visionOS scroll indicator and added guidance for integrating it with window layout. |
| June 5, 2023 | Updated guidance for using scroll views in watchOS. |

### search-fields — table (5 rows)

| Date | Changes |
| June 8, 2026 | Updated terminology and refined guidance for search as a tab in iOS. |
| June 9, 2025 | Updated guidance for search placement in iOS, consolidated iPadOS and macOS platform considerations, and added guidance for tokens. |
| September 12, 2023 | Combined guidance common to all platforms. |
| June 5, 2023 | Added guidance for using search fields in watchOS. |

### searching — table (3 rows)

| Date | Changes |
| June 8, 2026 | Updated terminology and refined best practices. |
| June 9, 2025 | Updated best practices with general guidance from Search fields, and reorganized guidance for systemwide search. |

### segmented-controls — table (2 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |

### settings — table (2 rows)

| Date | Changes |
| June 10, 2024 | Reorganized some guidance into new topics and added game-specific examples. |

### sf-symbols — table (5 rows)

| Date | Changes |
| July 28, 2025 | Updated with guidance for Draw animations and gradient rendering in SF Symbols 7. |
| June 10, 2024 | Updated with guidance for new animations and features of SF Symbols 6. |
| June 5, 2023 | Added a new section on animations. Included animation guidance for custom symbols. |
| September 14, 2022 | Added a new section on variable color. Removed instructions on creating custom symbol paths, exporting templates, and layering paths, deferring to developer articles that cover these topics. |

### sheets — table (6 rows)

| Date | Changes |
| March 24, 2026 | Updated guidance for button placement. |
| March 29, 2024 | Added guidance to use form or page sheet styles in iPadOS apps. |
| December 5, 2023 | Recommended using a split view to offer supplementary items in a visionOS app. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using sheets in watchOS. |

### sidebars — table (6 rows)

| Date | Changes |
| June 8, 2026 | Updated guidance for sidebar icon colors, and clarified guidance for the adaptable sidebar style. |
| June 9, 2025 | Added guidance for extending content beneath the sidebar. |
| August 6, 2024 | Updated guidance to include the SwiftUI adaptable sidebar style. |
| December 5, 2023 | Added artwork for iPadOS. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### sliders — table (2 rows)

| Date | Changes |
| June 21, 2023 | Updated to include guidance for visionOS. |

### snippets — table (2 rows)

| Date | Changes |
| June 8, 2026 | New page. |

### split-views — table (4 rows)

| Date | Changes |
| June 9, 2025 | Added iOS and iPadOS platform considerations. |
| December 5, 2023 | Added guidance for split views in visionOS. |
| June 5, 2023 | Added guidance for split views in watchOS. |

### tab-bars — table (7 rows)

| Date | Changes |
| June 8, 2026 | Updated terminology and art. |
| December 16, 2025 | Updated guidance for Liquid Glass. |
| July 28, 2025 | Added guidance for Liquid Glass. |
| September 9, 2024 | Added art representing the tab bar in iPadOS 18. |
| August 6, 2024 | Updated with guidance for the tab bar in iPadOS 18. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### tab-views — table (2 rows)

| Date | Changes |
| June 5, 2023 | Added guidance for using tab views in watchOS. |

### text-fields — table (2 rows)

| Date | Changes |
| June 5, 2023 | Updated guidance to reflect changes in watchOS 10. |

### text-views — table (2 rows)

| Date | Changes |
| June 5, 2023 | Updated guidance to reflect changes in watchOS 10. |

### the-menu-bar — table (9 rows)

| Menu item | Action | Guidance |
| About YourAppName | Displays the About window for your app, which includes copyright and version information. | Prefer a short name of 16 characters or fewer. Don’t include a version number. |
| Settings… | Opens your  window, or your app’s page in iPadOS Settings. | Use only for app-level settings. If you also offer document-specific settings, put them in the File menu. |
| Optional app-specific items | Performs custom app-level setting or configuration actions. | List custom app-configuration items after the Settings item and within the same group. |
| Services (macOS only) | Displays a submenu of services from the system and other apps that apply to the current context. |  |
| Hide YourAppName (macOS only) | Hides your app and all of its windows, and then activates the most recently used app. | Use the same short app name you supply for the About item. |
| Hide Others (macOS only) | Hides all other open apps and their windows. |  |
| Show All (macOS only) | Shows all other open apps and their windows behind your app’s windows. |  |
| Quit YourAppName | Quits your app. Pressing Option changes Quit YourAppName to Quit and Keep Windows. | Use the same short app name you supply for the About item. |

### the-menu-bar — table (16 rows)

| Menu item | Action | Guidance |
| New Item | Creates a new document, file, or window. | For Item, use a term that names the type of item your app creates. For example, Calendar uses Event and Calendar. |
| Open | Can open the selected item or present an interface in which people select an item to open. | If people need to select an item in a separate interface, an ellipsis follows the command to indicate that more input is required. |
| Open Recent | Displays a submenu that lists recently opened documents and files that people can select, and typically includes a Clear Menu item. | List document and filenames that people recognize in the submenu; don’t display file paths. List the documents in the order people last opened them, with the most recently opened document first. |
| Close | Closes the current window or document. Pressing Option changes Close to Close All. For a tab-based window, Close Tab replaces Close. | In a tab-based window, consider adding a Close Window item to let people close the entire window with one click or tap. |
| Close Tab | Closes the current tab in a tab-based window. Pressing Option changes Close Tab to Close Other Tabs. |  |
| Close File | Closes the current file and all its associated windows. | Consider supporting this menu item if your app can open multiple views of the same file. |
| Save | Saves the current document or file. | Automatically save changes periodically as people work so they don’t need to keep choosing File > Save. For a new document, prompt people for a name and location. If you need to let people save a file in multiple formats, prefer a pop-up menu that lets people choose a format in the Save sheet. |
| Save All | Saves all open documents. |  |
| Duplicate | Duplicates the current document, leaving both documents open. Pressing Option changes Duplicate to Save As. | Prefer Duplicate to menu items like Save As, Export, Copy To, and Save To because these items don’t clarify the relationship between the original file and the new one. |
| Rename… | Lets people change the name of the current document. |  |
| Move To… | Prompts people to choose a new location for the document. |  |
| Export As… | Prompts people for a name, output location, and export file format. After exporting the file, the current document remains open; the exported file doesn’t open. | Reserve the Export As item for when you need to let people export content in a format your app doesn’t typically handle. |
| Revert To | When people turn on autosaving, displays a submenu that lists recent document versions and an option to display the version browser. After people choose a version to restore, it replaces the current document. |  |
| Page Setup… | Opens a panel for specifying printing parameters like paper size and printing orientation. A document can save the printing parameters that people specify. | Include the Page Setup item if you need to support printing parameters that apply to a specific document. Parameters that are global in nature, like a printer’s name, or that people change frequently, like the number of copies to print, belong in the Print panel. |
| Print… | Opens the standard Print panel, which lets people print to a printer, send a fax, or save as a PDF. |  |

### the-menu-bar — table (16 rows)

| Menu item | Action | Guidance |
| Undo | Reverses the effect of the previous user operation. | Clarify the target of the undo. For example, if people just selected a menu item, you can append the item’s title, such as Undo Paste and Match Style. For a text entry operation, you might append the word Typing to give Undo Typing. |
| Redo | Reverses the effect of the previous Undo operation. | Clarify the target of the redo. For example, if people just reversed a menu item selection, you can append the item’s title, such as Redo Paste and Match Style. For a text entry operation, you might append the word Typing to give Redo Typing. |
| Cut | Removes the selected data and stores it on the Clipboard, replacing the previous contents of the Clipboard. |  |
| Copy | Duplicates the selected data and stores it on the Clipboard. |  |
| Paste | Inserts the contents of the Clipboard at the current insertion point. The Clipboard contents remain unchanged, permitting people to choose Paste multiple times. |  |
| Paste and Match Style | Inserts the contents of the Clipboard at the current insertion point, matching the style of the inserted text to the surrounding text. |  |
| Delete | Removes the selected data, but doesn’t place it on the Clipboard. | Provide a Delete menu item instead of an Erase or Clear menu item. Choosing Delete is the equivalent of pressing the Delete key, so it’s important for the naming to be consistent. |
| Select All | Highlights all selectable content in the current document or text container. |  |
| Find | Displays a submenu containing menu items for performing search operations in the current document or text container. Standard submenus include: Find, Find and Replace, Find Next, Find Previous, Use Selection for Find, and Jump to Selection. |  |
| Spelling and Grammar | Displays a submenu containing menu items for checking for and correcting spelling and grammar in the current document or text container. Standard submenus include: Show Spelling and Grammar, Check Document Now, Check Spelling While Typing, Check Grammar With Spelling, and Correct Spelling Automatically. |  |
| Substitutions | Displays a submenu containing items that let people toggle automatic substitutions while they type in a document or text container. Standard submenus include: Show Substitutions, Smart Copy/Paste, Smart Quotes, Smart Dashes, Smart Links, Data Detectors, and Text Replacement. |  |
| Transformations | Displays a submenu containing items that transform selected text. Standard submenus include: Make Uppercase, Make Lowercase, and Capitalize. |  |
| Speech | Displays a submenu containing Start Speaking and Stop Speaking items, which control when the system audibly reads selected text. |  |
| Start Dictation | Opens the dictation window and converts spoken words into text that’s added at the current insertion point. The system automatically adds the Start Dictation menu item at the bottom of the Edit menu. |  |
| Emoji & Symbols | Displays a Character Viewer, which includes emoji, symbols, and other characters people can insert at the current insertion point. The system automatically adds the Emoji & Symbols menu item at the bottom of the Edit menu. |  |

### the-menu-bar — table (3 rows)

| Menu item | Action |
| Font | Displays a submenu containing items for adjusting font attributes of the selected text. Standard submenus include: Show Fonts, Bold, Italic, Underline, Bigger, Smaller, Show Colors, Copy Style, and Paste Style. |
| Text | Displays a submenu containing items for adjusting text attributes of the selected text. Standard submenus include: Align Left, Align Center, Justify, Align Right, Writing Direction, Show Ruler, Copy Ruler, and Paste Ruler. |

### the-menu-bar — table (7 rows)

| Menu item | Action |
| Show/Hide Tab Bar | Toggles the visibility of the  above the body area in a tab-based window |
| Show All Tabs/Exit Tab Overview | Enters and exits a view (similar to Mission Control) that provides an overview of all open tabs in a tab-based window |
| Show/Hide Toolbar | In a window that includes a , toggles the toolbar’s visibility |
| Customize Toolbar | In a window that includes a toolbar, opens a view that lets people customize toolbar items |
| Show/Hide Sidebar | In a window that includes a , toggles the sidebar’s visibility |
| Enter/Exit Full Screen | In an app that supports a , opens the window at full-screen size in a new space |

### the-menu-bar — table (10 rows)

| Menu item | Action | Guidance |
| Minimize | Minimizes the active window to the Dock. Pressing the Option key changes this item to Minimize All. |  |
| Zoom | Toggles between a predefined size appropriate to the window’s content and the window size people set. Pressing the Option key changes this item to Zoom All. | Avoid using Zoom to enter or exit full-screen mode. The  supports these functions. |
| Show Previous Tab | Shows the tab before the current tab in a tab-based window. |  |
| Show Next Tab | Shows the tab after the current tab in a tab-based window. |  |
| Move Tab to New Window | Opens the current tab in a new window. |  |
| Merge All Windows | Combines all open windows into a single tabbed window. |  |
| Enter/Exit Full Screen | In an app that supports a , opens the window at full-screen size in a new space. | Include this item in the Window menu only if your app doesn’t have a View menu. In this scenario, continue to provide separate Minimize and Zoom menu items. |
| Bring All to Front | Brings all an app’s open windows to the front, maintaining their onscreen location, size, and layering order. (Clicking the app icon in the Dock has the same effect.) Pressing the Option key changes this item to Arrange in Front, which brings an app’s windows to the front in a neatly tiled arrangement. |  |
| Name of an open app-specific window | Brings the selected window to the front. | List the currently open windows in alphabetical order for easy scanning. Avoid listing panels or other modal views. |

### the-menu-bar — table (4 rows)

| Menu item | Action | Guidance |
| Send YourAppName Feedback to Apple | Opens the Feedback Assistant, in which people can provide feedback. |  |
| YourAppName Help | When the content uses the Help Book format, opens the content in the built-in Help Viewer. |  |
| Additional Item |  | Use a separator between your primary help documentation and additional items, which might include registration information or release notes. Keep the total the number of items you list in the Help menu small to avoid overwhelming people with too many choices when they need help. Alternatively, consider linking to additional items from within your help documentation. |

### the-menu-bar — table (7 rows)

|  | iPadOS | macOS |
| Menu bar visibility | Hidden until revealed | Visible by default |
| Horizontal alignment | Centered | Leading side |
| Menu bar extras | Not available | System default and custom |
| Window controls | In the menu bar when the app is full screen | Never in the menu bar |
| Apple menu | Not available | Always available |
| App menu | About, Services, and app visibility-related items not available | Always available |

### the-menu-bar — table (2 rows)

| Date | Changes |
| June 9, 2025 | Added guidance for the menu bar in iPadOS. |

### toggles — table (3 rows)

| Date | Changes |
| March 29, 2024 | Enhanced guidance for using switches in macOS apps, clarified when a checkbox has a title, and added artwork for radio buttons. |
| September 12, 2023 | Updated artwork. |

### toolbars — table (5 rows)

| Date | Changes |
| December 16, 2025 | Updated guidance for Liquid Glass. |
| June 9, 2025 | Added guidance for grouping bar items, updated guidance for using symbols, and incorporated navigation bar guidance. |
| June 21, 2023 | Updated to include guidance for visionOS. |
| June 5, 2023 | Updated guidance for using toolbars in watchOS. |

### top-shelf — table (2 rows)

| Image size |
| 2320x720 pt (2320x720 px @1x, 4640x1440 px @2x) |

### top-shelf — table (4 rows)

| Aspect | Image size |
| Actual size | 404x608 pt (404x608 px @1x, 808x1216 px @2x) |
| Focused/Safe zone size | 380x570 pt (380x570 px @1x, 760x1140 px @2x) |
| Unfocused size | 333x570 pt (333x570 px @1x, 666x1140 px @2x) |

### top-shelf — table (4 rows)

| Aspect | Image size |
| Actual size | 608x608 pt (608x608 px @1x, 1216x1216 px @2x) |
| Focused/Safe zone size | 570x570 pt (570x570 px @1x, 1140x1140 px @2x) |
| Unfocused size | 500x500 pt (500x500 px @1x, 1000x1000 px @2x) |

### top-shelf — table (4 rows)

| Aspect | Image size |
| Actual size | 908x512 pt (908x512 px @1x, 1816x1024 px @2x) |
| Focused/Safe zone size | 852x479 pt (852x479 px @1x, 1704x958 px @2x) |
| Unfocused size | 782x440 pt (782x440 px @1x, 1564x880 px @2x) |

### top-shelf — table (4 rows)

| Aspect | Image size |
| Actual size | 1940x692 pt (1940x692 px @1x, 3880x1384 px  @2x) |
| Focused/Safe zone size | 1740x620 pt (1740x620 px @1x, 3480x1240 px @2x) |
| Unfocused size | 1740x560 pt (1740x560 px @1x, 3480x1120 px @2x) |

### typography — table (6 rows)

| Platform | Default size | Minimum size |
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| tvOS | 29 pt | 23 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |

### typography — table (13 rows)

| Dynamic font variant | API |
| Control content |  |
| Label |  |
| Menu |  |
| Menu bar |  |
| Message |  |
| Palette |  |
| Title |  |
| Tool tips |  |
| Document text (user) |  |
| Monospaced document text (user fixed pitch) |  |
| Bold system font |  |
| System font |  |

### typography — table (12 rows)

| Text style | Weight | Size (points) | Line height (points) | Emphasized weight |
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | Bold | 13 | 16 | Heavy |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | Medium | 10 | 13 | Semibold |

### typography — table (10 rows)

| Text style | Weight | Size (points) | Leading (points) | Emphasized weight |
| Title 1 | Medium | 76 | 96 | Bold |
| Title 2 | Medium | 57 | 66 | Bold |
| Title 3 | Medium | 48 | 56 | Bold |
| Headline | Medium | 38 | 46 | Bold |
| Subtitle 1 | Regular | 38 | 46 | Medium |
| Callout | Medium | 31 | 38 | Bold |
| Body | Medium | 29 | 36 | Bold |
| Caption 1 | Medium | 25 | 32 | Bold |
| Caption 2 | Medium | 23 | 30 | Bold |

### typography — table (65 rows)

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
| 6 | +41 | +0.24 |
| 7 | +34 | +0.23 |
| 8 | +26 | +0.21 |
| 9 | +19 | +0.17 |
| 10 | +12 | +0.12 |
| 11 | +6 | +0.06 |
| 12 | 0 | 0.0 |
| 13 | -6 | -0.08 |
| 14 | -11 | -0.15 |
| 15 | -16 | -0.23 |
| 16 | -20 | -0.31 |
| 17 | -26 | -0.43 |
| 18 | -25 | -0.44 |
| 19 | -24 | -0.45 |
| 20 | -23 | -0.45 |
| 21 | -18 | -0.36 |
| 22 | -12 | -0.26 |
| 23 | -4 | -0.10 |
| 24 | +3 | +0.07 |
| 25 | +6 | +0.15 |
| 26 | +8 | +0.22 |
| 27 | +11 | +0.29 |
| 28 | +14 | +0.38 |
| 29 | +14 | +0.40 |
| 30 | +14 | +0.40 |
| 31 | +13 | +0.39 |
| 32 | +13 | +0.41 |
| 33 | +12 | +0.40 |
| 34 | +12 | +0.40 |
| 35 | +11 | +0.38 |
| 36 | +10 | +0.37 |
| 37 | +10 | +0.36 |
| 38 | +10 | +0.37 |
| 39 | +10 | +0.38 |
| 40 | +10 | +0.37 |
| 41 | +9 | +0.36 |
| 42 | +9 | +0.37 |
| 43 | +9 | +0.38 |
| 44 | +8 | +0.37 |
| 45 | +8 | +0.35 |
| 46 | +8 | +0.36 |
| 47 | +8 | +0.37 |
| 48 | +8 | +0.35 |
| 49 | +7 | +0.33 |
| 50 | +7 | +0.34 |
| 51 | +7 | +0.35 |
| 52 | +6 | +0.31 |
| 53 | +6 | +0.33 |
| 54 | +6 | +0.32 |
| 56 | +6 | +0.30 |
| 58 | +5 | +0.28 |
| 60 | +4 | +0.26 |
| 62 | +4 | +0.24 |
| 64 | +4 | +0.22 |
| 66 | +3 | +0.19 |
| 68 | +2 | +0.17 |
| 70 | +2 | +0.14 |
| 72 | +2 | +0.14 |
| 76 | +1 | +0.07 |
| 80 | 0 | 0 |
| 84 | 0 | 0 |
| 88 | 0 | 0 |
| 92 | 0 | 0 |
| 96 | 0 | 0 |

### typography — table (65 rows)

| Size (points) | Tracking (1/1000 em) | Tracking (points) |
| 6 | +41 | +0.24 |
| 7 | +34 | +0.23 |
| 8 | +26 | +0.21 |
| 9 | +19 | +0.17 |
| 10 | +12 | +0.12 |
| 11 | +6 | +0.06 |
| 12 | 0 | 0.0 |
| 13 | -6 | -0.08 |
| 14 | -11 | -0.15 |
| 15 | -16 | -0.23 |
| 16 | -20 | -0.31 |
| 17 | -26 | -0.43 |
| 18 | -25 | -0.44 |
| 19 | -24 | -0.45 |
| 20 | -23 | -0.45 |
| 21 | -18 | -0.36 |
| 22 | -12 | -0.26 |
| 23 | -4 | -0.10 |
| 24 | +3 | +0.07 |
| 25 | +6 | +0.15 |
| 26 | +8 | +0.22 |
| 27 | +11 | +0.29 |
| 28 | +14 | +0.38 |
| 29 | +14 | +0.40 |
| 30 | +14 | +0.40 |
| 31 | +13 | +0.39 |
| 32 | +13 | +0.41 |
| 33 | +12 | +0.40 |
| 34 | +12 | +0.40 |
| 35 | +11 | +0.38 |
| 36 | +10 | +0.37 |
| 37 | +10 | +0.36 |
| 38 | +10 | +0.37 |
| 39 | +10 | +0.38 |
| 40 | +10 | +0.37 |
| 41 | +9 | +0.36 |
| 42 | +9 | +0.37 |
| 43 | +9 | +0.38 |
| 44 | +8 | +0.37 |
| 45 | +8 | +0.35 |
| 46 | +8 | +0.36 |
| 47 | +8 | +0.37 |
| 48 | +8 | +0.35 |
| 49 | +7 | +0.33 |
| 50 | +7 | +0.34 |
| 51 | +7 | +0.35 |
| 52 | +6 | +0.31 |
| 53 | +6 | +0.33 |
| 54 | +6 | +0.32 |
| 56 | +6 | +0.30 |
| 58 | +5 | +0.28 |
| 60 | +4 | +0.26 |
| 62 | +4 | +0.24 |
| 64 | +4 | +0.22 |
| 66 | +3 | +0.19 |
| 68 | +2 | +0.17 |
| 70 | +2 | +0.14 |
| 72 | +2 | +0.14 |
| 76 | +1 | +0.07 |
| 80 | 0 | 0 |
| 84 | 0 | 0 |
| 88 | 0 | 0 |
| 92 | 0 | 0 |
| 96 | 0 | 0 |

### typography — table (6 rows)

| Date | Changes |
| December 16, 2025 | Added emphasized weights to the Dynamic Type style specifications for each platform. |
| March 7, 2025 | Expanded guidance for Dynamic Type. |
| June 10, 2024 | Added guidance for using Apple’s Unity plug-ins to support Dynamic Type in a Unity-based game and enhanced guidance on billboarding in a visionOS app or game. |
| September 12, 2023 | Added artwork illustrating system font weights, and clarified tvOS specification table descriptions. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### virtual-keyboards — table (5 rows)

| Date | Changes |
| June 9, 2025 | Added guidance for displaying custom controls above the keyboard, and updated to reflect virtual keyboard availability in watchOS. |
| February 2, 2024 | Clarified the virtual keyboard’s support for direct and indirect gestures in visionOS. |
| December 5, 2023 | Added artwork for visionOS. |
| June 21, 2023 | Changed page title from Onscreen keyboards and updated to include guidance for visionOS. |

### widgets — table (6 rows)

| Widget size | iPhone | iPad | Mac | Apple Vision Pro |
| System small | Home Screen, Today View, StandBy, and CarPlay | Home Screen, Today View, and Lock Screen | Desktop and Notification Center | Horizontal and vertical surfaces |
| System medium | Home Screen and Today View | Home Screen and Today View | Desktop and Notification Center | Horizontal and vertical surfaces |
| System large | Home Screen and Today View | Home Screen and Today View | Desktop and Notification Center | Horizontal and vertical surfaces |
| System extra large | Not supported | Home Screen and Today View | Desktop and Notification Center | Horizontal and vertical surfaces |
| System extra large portrait | Not supported | Not supported | Not supported | Horizontal and vertical surfaces |

### widgets — table (5 rows)

| Widget size | iPhone | iPad | Apple Watch |
| Accessory circular | Lock Screen | Lock Screen | Watch complications and in the Smart Stack |
| Accessory corner | Not supported | Not supported | Watch complications |
| Accessory inline | Lock Screen | Lock Screen | Watch complications |
| Accessory rectangular | Lock Screen | Lock Screen | Watch complications and in the Smart Stack |

### widgets — table (6 rows)

| Platform | Full-color | Accented | Vibrant |
| iPhone | Home Screen, Today view, StandBy and CarPlay (with the background removed) | Home Screen and Today view | Lock Screen, StandBy in low-light conditions |
| iPad | Home Screen and Today view | Home Screen and Today view | Lock Screen |
| Apple Watch | Smart Stack, complications | Smart Stack, complications | Not supported |
| Mac | Desktop and Notification Center | Not supported | Desktop |
| Apple Vision Pro | Horizontal and vertical surfaces | Horizontal and vertical surfaces | Not supported |

### widgets — table (11 rows)

| Screen size (portrait, pt) | Small (pt) | Medium (pt) | Large (pt) | Circular (pt) | Rectangular (pt) | Inline (pt) |
| 430×932 | 170x170 | 364x170 | 364x382 | 76x76 | 172x76 | 257x26 |
| 428x926 | 170x170 | 364x170 | 364x382 | 76x76 | 172x76 | 257x26 |
| 414x896 | 169x169 | 360x169 | 360x379 | 76x76 | 160x72 | 248x26 |
| 414x736 | 159x159 | 348x157 | 348x357 | 76x76 | 170x76 | 248x26 |
| 393x852 | 158x158 | 338x158 | 338x354 | 72x72 | 160x72 | 234x26 |
| 390x844 | 158x158 | 338x158 | 338x354 | 72x72 | 160x72 | 234x26 |
| 375x812 | 155x155 | 329x155 | 329x345 | 72x72 | 157x72 | 225x26 |
| 375x667 | 148x148 | 321x148 | 321x324 | 68x68 | 153x68 | 225x26 |
| 360x780 | 155x155 | 329x155 | 329x345 | 72x72 | 157x72 | 225x26 |
| 320x568 | 141x141 | 292x141 | 292x311 | N/A | N/A | N/A |

### widgets — table (21 rows)

| Screen size (portrait, pt) | Target | Small (pt) | Medium (pt) | Large (pt) | Extra large (pt) |
| 768x1024 | Canvas | 141x141 | 305.5x141 | 305.5x305.5 | 634.5x305.5 |
|  | Device | 120x120 | 260x120 | 260x260 | 540x260 |
| 744x1133 | Canvas | 141x141 | 305.5x141 | 305.5x305.5 | 634.5x305.5 |
|  | Device | 120x120 | 260x120 | 260x260 | 540x260 |
| 810x1080 | Canvas | 146x146 | 320.5x146 | 320.5x320.5 | 669x320.5 |
|  | Device | 124x124 | 272x124 | 272x272 | 568x272 |
| 820x1180 | Canvas | 155x155 | 342x155 | 342x342 | 715.5x342 |
|  | Device | 136x136 | 300x136 | 300x300 | 628x300 |
| 834x1112 | Canvas | 150x150 | 327.5x150 | 327.5x327.5 | 682x327.5 |
|  | Device | 132x132 | 288x132 | 288x288 | 600x288 |
| 834x1194 | Canvas | 155x155 | 342x155 | 342x342 | 715.5x342 |
|  | Device | 136x136 | 300x136 | 300x300 | 628x300 |
| 954x1373 * | Canvas | 162x162 | 350x162 | 350x350 | 726x350 |
|  | Device | 162x162 | 350x162 | 350x350 | 726x350 |
| 970x1389 * | Canvas | 162x162 | 350x162 | 350x350 | 726x350 |
|  | Device | 162x162 | 350x162 | 350x350 | 726x350 |
| 1024x1366 | Canvas | 170x170 | 378.5x170 | 378.5x378.5 | 795x378.5 |
|  | Device | 160x160 | 356x160 | 356x356 | 748x356 |
| 1192x1590 * | Canvas | 188x188 | 412x188 | 412x412 | 860x412 |
|  | Device | 188x188 | 412x188 | 412x412 | 860x412 |

### widgets — table (6 rows)

| Widget | Size in pt | Size in mm (scaled to 100%) |
| Small | 158x158 | 268x268 |
| Medium | 338x158 | 574x268 |
| Large | 338x354 | 574x600 |
| Extra large | 450x338 | 763x574 |
| Extra large portrait | 338x450 | 574x763 |

### widgets — table (6 rows)

| Apple Watch size | Size of a widget in the Smart Stack (pt) |
| 40mm | 152x69.5 |
| 41mm | 165x72.5 |
| 44mm | 173x76.5 |
| 45mm | 184x80.5 |
| 49mm | 191x81.5 |

### widgets — table (6 rows)

| Date | Changes |
| December 16, 2025 | Updated guidance for all platforms, and added guidance for visionOS and CarPlay. |
| January 17, 2025 | Corrected watchOS widget dimensions. |
| June 10, 2024 | Updated to include guidance for accented widgets in iOS 18 and iPadOS 18. |
| June 5, 2023 | Updated guidance to include widgets in watchOS, widgets on the iPad Lock Screen, and updates for iOS 17, iPadOS 17, and macOS 14. |
| November 3, 2022 | Added guidance for widgets on the iPhone Lock Screen and updated design comprehensives for iPhone 14, iPhone 14 Pro, and iPhone 14 Pro Max. |

### windows — table (4 rows)

| Date | Changes |
| June 9, 2025 | Added best practices, and updated with guidance for resizable windows in iPadOS. |
| June 10, 2024 | Updated to include guidance for using volumes in visionOS 2 and added game-specific examples. |
| June 21, 2023 | Updated to include guidance for visionOS. |

### writing — table (3 rows)

| Date | Changes |
| December 16, 2025 | Clarified guidance on language patterns, and added guidance for possessive pronouns. |
| February 27, 2023 | New page. |

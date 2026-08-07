# Apple Human Interface Guidelines — extracted reference

Crawled from developer.apple.com JSON API. 109 pages.


---

## Accessibility

`/design/human-interface-guidelines/accessibility`

_Accessible user interfaces empower everyone to have a great experience with your app or game._

When you design for accessibility, you reach a larger audience and create a more inclusive experience. An accessible interface allows people to experience your app or game regardless of their capabilities or how they use their devices. Accessibility makes information and interactions available to everyone. An accessible interface is:

- Intuitive. Your interface uses familiar and consistent interactions that make tasks straightforward to perform.

- Perceivable. Your interface doesn’t rely on any single method to convey information. People can access and interact with your content, whether they use sight, hearing, speech, or touch.

- Adaptable. Your interface adapts to how people want to use their device, whether by supporting system accessibility features or letting people personalize settings.

As you design your app, audit the accessibility of your interface. Use  to highlight accessibility issues with your interface and to understand how your app represents itself to people using system accessibility features. You can also communicate how accessible your app is on the App Store using Accessibility Nutrition Labels. To learn more about how to evaluate and indicate accessibility feature support, see  in App Store Connect help.


### Vision

The people who use your interface may be blind, color blind, or have low vision or light sensitivity. They may also be in situations where lighting conditions and screen brightness affect their ability to interact with your interface.

Support larger text sizes. Make sure people can adjust the size of your text or icons to make them more legible, visible, and comfortable to read. Ideally, give people the option to enlarge text by at least 200 percent (or 140 percent in watchOS apps). Your interface can support font size enlargement either through custom UI, or by adopting Dynamic Type. Dynamic Type is a systemwide setting that lets people adjust the size of text for comfort and legibility. For more guidance, see .

Use recommended defaults for custom type sizes. Each platform has different default and minimum sizes for system-defined type styles to promote readability. If you’re using custom type styles, follow the recommended defaults.

Bear in mind that font weight can also impact how easy text is to read. If you’re using a custom font with a thin weight, aim for larger than the recommended sizes to increase legibility. For more guidance, see .

Strive to meet color contrast minimum standards. To ensure all information in your app is legible, it’s important that there’s enough contrast between foreground text and icons and background colors. Two popular standards of measure for color contrast are the  and the Accessible Perceptual Contrast Algorithm (APCA). Use standard contrast calculators to ensure your UI meets acceptable levels.  uses the following values from WCAG Level AA as guidance in determining whether your app’s colors have an acceptable contrast.

If your app doesn’t provide this minimum contrast by default, ensure it at least provides a higher contrast color scheme when the system setting Increase Contrast is turned on. If your app supports , make sure to check the minimum contrast in both light and dark appearances.

Prefer system-defined colors. These colors have their own accessible variants that automatically adapt when people adjust their color preferences, such as enabling Increase Contrast or toggling between the light and dark appearances. For guidance, see .

Convey information with more than color alone. Some people have trouble differentiating between certain colors and shades. For example, people who are color blind may have particular difficulty with pairings such as red-green and blue-orange. Offer visual indicators, like distinct shapes or icons, in addition to color to help people perceive differences in function and changes in state. Consider allowing people to customize color schemes such as chart colors or game characters so they can personalize your interface in a way that’s comfortable for them.

Describe your app’s interface and content for VoiceOver. VoiceOver is a screen reader that lets people experience your app’s interface without needing to see the screen. For more guidance, see .


### Hearing

The people who use your interface may be deaf or hard of hearing. They may also be in noisy or public environments.

Support text-based ways to enjoy audio and video. It’s important that dialogue and crucial information about your app or game isn’t communicated through audio alone. Depending on the context, give people different text-based ways to experience their media, and allow people to customize the visual presentation of that text:

- Captions give people the textual equivalent of audible information in video or audio-only content. Captions are great for scenarios like game cutscenes and video clips where text synchronizes live with the media.

- Subtitles allow people to read live onscreen dialogue in their preferred language. Subtitles are great for TV shows and movies.

- Audio descriptions are interspersed between natural pauses in the main audio of a video and supply spoken narration of important information that’s presented only visually.

- Transcripts provide a complete textual description of a video, covering both audible and visual information. Transcripts are great for longer-form media like podcasts and audiobooks where people may want to review content as a whole or highlight the transcript as media is playing.

For developer guidance, see .

Use haptics in addition to audio cues. If your interface conveys information through audio cues — such as a success chime, error sound, or game feedback — consider pairing that sound with matching haptics for people who can’t perceive the audio or have their audio turned off. In iOS and iPadOS, you can also use  and  to let people experience music and infographics through vibration and texture. For guidance, see .

Augment audio cues with visual cues. This is especially important for games and spatial apps where important content might be taking place off screen. When using audio to guide people towards a specific action, also add in visual indicators that point to where you want people to interact.


### Mobility

Ensure your interface offers a comfortable experience for people with limited dexterity or mobility.

Offer sufficiently sized controls. Controls that are too small are hard for many people to interact with and select. Strive to meet the recommended minimum control size for each platform to ensure controls and menus are comfortable for all when tapping and clicking.

Consider spacing between controls as important as size. Include enough padding between elements to reduce the chance that someone taps the wrong control. In general, it works well to add about 12 points of padding around elements that include a bezel. For elements without a bezel, about 24 points of padding works well around the element’s visible edges.

Support simple gestures for common interactions. For many people, with or without disabilities, complex gestures can be challenging. For interactions people do frequently in your app or game, use the simplest gesture possible — avoid custom multifinger and multihand gestures — so repetitive actions are both comfortable and easy to remember.

Offer alternatives to gestures. Make sure your UI’s core functionality is accessible through more than one type of physical interaction. Gestures can be less comfortable for people who have limited dexterity, so offer onscreen ways to achieve the same outcome. For example, if you use a swipe gesture to dismiss a view, also make a button available so people can tap or use an assistive device.

Let people use Voice Control to give guidance and enter information verbally. With Voice Control, people can interact with their devices entirely by speaking commands. They can perform gestures, interact with screen elements, dictate and edit text, and more. To ensure a smooth experience, label interface elements appropriately. For developer guidance, see .

Integrate with Siri and Shortcuts to let people perform tasks using voice alone. When your app supports Siri and Shortcuts, people can automate the important and repetitive tasks they perform regularly. They can initiate these tasks from Siri, the Action button on their iPhone or Apple Watch, and shortcuts on their Home Screen or in Control Center. For guidance, see .

Support mobility-related assistive technologies. Features like , AssistiveTouch, Full Keyboard Access, Pointer Control, and  offer alternative ways for people with low mobility to interact with their devices. Conduct testing and verify that your app or game supports these technologies, and that your interface elements are appropriately labeled to ensure a great experience. For more information, see .


### Speech

Apple’s accessibility features help people with speech disabilities and people who prefer text-based interactions to communicate effectively using their devices.

Let people use the keyboard alone to navigate and interact with your app. People can turn on Full Keyboard Access to navigate apps using their physical keyboard. The system also defines accessibility keyboard shortcuts and a wide range of other  that many people use all the time. Avoid overriding system-defined keyboard shortcuts and evaluate your app to ensure it works well with Full Keyboard Access. For additional guidance, see . For developer guidance, see .

Support Switch Control. Switch Control is an assistive technology that lets people control their devices through separate hardware, game controllers, or sounds such as a click or a pop. People can perform actions like selecting, tapping, typing, and drawing when your app or game supports the ability to navigate using Switch Control. For developer guidance, see .


### Cognitive

When you minimize complexity in your app or game, all people benefit.

Keep actions simple and intuitive. Ensure that people can navigate your interface using easy-to-remember and consistent interactions. Prefer system gestures and behaviors people are already familiar with over creating custom gestures people must learn and retain.

Minimize use of time-boxed interface elements. Views and controls that auto-dismiss on a timer can be problematic for people who need longer to process information, and for people who use assistive technologies that require more time to traverse the interface. Prefer dismissing views with an explicit action.

Consider offering difficulty accommodations in games. Everyone has their own way of playing and enjoying games. To support a variety of cognitive abilities, consider adding the ability to customize the difficulty level of your game, such as offering options for people to reduce the criteria for successfully completing a level, adjust reaction time, or enable control assistance.

Let people control audio and video playback. Avoid autoplaying audio and video content without also providing controls to start and stop it. Make sure these controls are discoverable and easy to act upon, and consider global settings that let people opt out of auto-playing all audio and video. For developer guidance, see  and .

Allow people to opt out of flashing lights in video playback. People might want to avoid bright, frequent flashes of light in the media they consume. A Dim Flashing Lights setting allows the system to calculate, mitigate, and inform people about flashing lights in a piece of media. If your app supports video playback, ensure that it responds appropriately to the Dim Flashing Lights setting. For developer guidance, see .

Be cautious with fast-moving and blinking animations. When you use these effects in excess, it can be distracting, cause dizziness, and in some cases even result in epileptic episodes. People who are prone to these effects can turn on the Reduce Motion accessibility setting. When this setting is active, ensure your app or game responds by reducing automatic and repetitive animations, including zooming, scaling, and peripheral motion. Other best practices for reducing motion include:

- Tightening animation springs to reduce bounce effects

- Tracking animations directly with people’s gestures

- Avoiding animating depth changes in z-axis layers

- Replacing transitions in x-, y-, and z-axes with fades to avoid motion

- Avoiding animating into and out of blurs

Optimize your app’s UI for Assistive Access. Assistive Access is an accessibility feature in iOS and iPadOS that allows people with cognitive disabilities to use a streamlined version of your app. Assistive Access sets a default layout and control presentation for apps that reduces cognitive load, such as the following layout of the Camera app.

To optimize your app for this mode, use the following guidelines when Assistive Access is turned on:

- Identify the core functionality of your app and consider removing noncritical workflows and UI elements.

- Break up multistep workflows so people can focus on a single interaction per screen.

- Always ask for confirmation twice whenever people perform an action that’s difficult to recover from, such a deleting a file.

For developer guidance, see .


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, or watchOS.


#### visionOS

visionOS offers a variety of accessibility features people can use to interact with their surroundings in ways that are comfortable and work best for them, including head and hand Pointer Control, and a Zoom feature.

Prioritize comfort. The immersive nature of visionOS means that interfaces, animations, and interactions have a greater chance of causing motion sickness, and visual and ergonomic discomfort for people. To ensure the most comfortable experience, consider these tips:

- Keep interface elements within a person’s field of view. Prefer horizontal layouts to vertical ones that might cause neck strain, and avoid demanding the viewer’s attention in different locations in quick succession.

- Reduce the speed and intensity of animated objects, particularly in someone’s peripheral vision.

- Be gentle with camera and video motion, and avoid situations where someone may feel like the world around them is moving without their control.

- Avoid anchoring content to the wearer’s head, which may make them feel stuck and confined, and also prevent them from using assistive technologies like Pointer Control.

- Minimize the need for large and repetitive gestures, as these can become tiresome and may be difficult depending on a person’s surroundings.

For additional guidance, see  and .


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## App icons

`/design/human-interface-guidelines/app-icons`

_A unique, memorable icon expresses your app’s or game’s purpose and personality and helps people recognize it at a glance._

Your app icon is a crucial aspect of your app’s or game’s branding and user experience. It appears on the Home Screen and in key locations throughout the system, including search results, notifications, system settings, and share sheets. A well-designed app icon conveys your app’s or game’s identity clearly and consistently across all Apple platforms.


### Layer design

Although you can provide a flattened image for your icon, layers give you the most control over how your icon design is represented. A layered app icon comes together to produce a sense of depth and vitality. On each platform, the system applies visual effects that respond to the environment and people’s interactions.

iOS, iPadOS, macOS, and watchOS app icons include a background layer and one or more foreground layers that coalesce to create dimensionality. These icons take on Liquid Glass attributes like specular highlights, refraction, and translucency. These effects automatically adapt with the size of your icon, apply consistently across platforms, and can appear differently between system versions.

tvOS app icons use between two and five layers to create a sense of dynamism as people bring them into focus. When focused, the app icon elevates to the foreground in response to someone’s finger movement on their remote, and gently sways while the surface illuminates. The separation between layers and the use of transparency produce a feeling of depth during the parallax effect.

A visionOS app icon includes a background layer and one or two layers on top, producing a three-dimensional object that subtly expands when people view it. The system enhances the icon’s visual dimensionality by adding shadows that convey a sense of depth between layers and by using the alpha channel of the upper layers to create an embossed appearance.

You use your favorite design tool to craft the individual foreground layers of your app icon. For iOS, iPadOS, macOS, and watchOS icons, you then import your icon layers into Icon Composer, a design tool included with Xcode and available from the . In Icon Composer, you define the background layer for your icon, adjust your foreground layer placement, apply visual effects like specular highlights and refraction, annotate for default, dark, and mono appearance variants, test and preview your icon across system versions, and export your icon for use in Xcode. For additional guidance, see .

For tvOS and visionOS app icons, you add your icon layers directly to an image stack in Xcode to form your complete icon. You can download Parallax Previewer and Parallax Exporter plug-in from  to preview and test parallax visual effects. For developer guidance, see .

Prefer clearly defined edges in foreground layers. To ensure system-drawn highlights and shadows look best, avoid soft and feathered edges on foreground layer shapes.

Vary opacity in foreground layers to increase the sense of depth and liveliness. For example, the Photos icon separates its centerpiece into multiple layers that contain translucent pieces, bringing greater dynamism to the design. Importing fully opaque layers and adjusting transparency in Icon Composer lets you preview and make adjustments to your design based on how transparency and system effects impact one another.

Design a background that both stands out and emphasizes foreground content. If you choose a gradient for your background layer, ensure that it responds well to system lighting effects. Icon Composer supports solid colors and gradients for background layers, making it unnecessary to import custom background images in most cases. If you do import a background layer, make sure it’s full-bleed and opaque.

Prefer vector graphics when bringing layers into Icon Composer. Unlike raster images, vector graphics (such as SVG or PDF) scale gracefully and appear crisp at any size. Outline artwork and convert text to outline in your design. For mesh gradients and raster artwork, prefer PNG format because it’s a lossless image format.


### Icon shape

An app icon’s shape varies based on a platform’s visual language. In iOS, iPadOS, and macOS, icons are square, and the system applies masking to produce rounded corners that precisely match the curvature of other rounded interface elements throughout the system and the bezel of the physical device itself. In tvOS, icons are rectangular, also with concentric edges. In visionOS and watchOS, icons are square and the system applies circular masking.

Produce appropriately shaped, unmasked layers. The system masks all layer edges to produce an icon’s final shape. For iOS, iPadOS, and macOS icons, provide square layers so the system can apply rounded corners. For visionOS and watchOS, provide square layers so the system can create the circular icon shape. For tvOS, provide rectangular layers so the system can apply rounded corners. Providing layers with pre-defined masking negatively impacts specular highlight effects and makes edges look jagged.

Keep primary content centered to avoid truncation when the system adjusts corners or applies masking. Pay particular attention to centering content in visionOS and watchOS icons. To help with icon placement, use the grids in the app icon production templates, which you can find in .


### Design

Embrace simplicity in your icon design. Simple icons tend to be easiest for people to understand and recognize. An icon with fine visual features might look busy when rendered with system-provided shadows and highlights, and details may be hard to discern at smaller sizes. Find a concept or element that captures the essence of your app or game, make it the core idea of your icon, and express it in a simple, unique way with a minimal number of shapes. Prefer a simple background, such as a solid color or gradient, that puts the emphasis on your primary design — you don’t need to fill the entire icon canvas with content.

Provide a visually consistent icon design across all the platforms your app supports. A consistent design helps people quickly find your app wherever it appears and prevents people from mistaking your app for multiple apps.

Consider basing your icon design around filled, overlapping shapes. Overlapping solid shapes in the foreground, particularly when paired with transparency and blurring, can give an icon a sense of depth.

Include text only when it’s essential to your experience or brand. Text in icons doesn’t support accessibility or localization, is often too small to read easily, and can make an icon appear cluttered. In some contexts, your app name already appears nearby, making it redundant to display the name within the icon itself. Although displaying a mnemonic like the first letter of your app’s name can help people recognize your app or game, avoid including nonessential words that tell people what to do with it — like “Watch” or “Play” — or context-specific terms like “New” or “For visionOS.” If you include text in a tvOS app icon, make sure it’s above other layers so it’s not cropped by the parallax effect.

Prefer illustrations to photos and avoid replicating UI components. Photos are full of details that don’t work well when displayed in different appearances, viewed at small sizes, or split into layers. Instead of using photos, create a graphic representation of the content that emphasizes the features you want people to notice. Make sure to avoid extremely thin line weights and sharp corners, because they tend to lose detail and crispness in smaller icon sizes at lower resolutions. If your app has an interface that people recognize, don’t just replicate standard UI components or use app screenshots in your icon.

Don’t use replicas of Apple hardware products. Apple products are copyrighted and can’t be reproduced in your app icons.


### Visual effects

Let the system handle blurring and other visual effects. The system dynamically applies visual effects to your app icon layers, so there’s no need to include specular highlights, drop shadows between layers, beveled edges, blurs, glows, and other effects. In addition to interfering with system-provided effects, custom effects are static, whereas the system supplies dynamic ones. If you do include custom visual effects on your icon layers, use them intentionally and test carefully with Icon Composer, on a simulated device in Device Hub, or on a physical device to make sure they appear as expected and don’t conflict with system effects.

Create layer groupings to apply effects to multiple layers at once. System effects typically occur on individual layers. If it makes sense for your design, however, you can group several layers together in Icon Composer or your design tool so effects occur at the group level. For a group, Icon Composer provides additional customization options for Liquid Glass effects, so you can configure attributes like specular highlights, refraction, and translucency.


### Appearances

In iOS, iPadOS, and macOS, people can choose whether their Home Screen app icons are default, dark, clear, or tinted in appearance. For example, someone may want to personalize their app icon appearance to complement their wallpaper. You can design app icon variants for every appearance variant, and the system automatically generates variants you don’t provide.

Keep your icon’s features consistent across appearances. To create a seamless experience, keep your icon’s core visual features the same in the default, dark, clear, and tinted appearances. Avoid creating custom icon variants that swap elements in and out with each variant, which may make it harder for people to find your app when they switch appearances.

Design dark and tinted icons that feel at home beside system app icons and widgets. You can preserve the color palette of your default icon, but be mindful that dark icons are more subdued, and clear and tinted icons are even more so. A great app icon is visible, legible, and recognizable, regardless of its appearance variant.

Use your light app icon as the basis for your dark icon. Choose complementary colors that reflect the default design, and avoid excessively bright images. Color backgrounds generally offer the greatest contrast in dark icons. For guidance, see .

Consider offering alternate app icons. In iOS, iPadOS, tvOS, and compatible apps running in visionOS, it’s possible to let people visit your app’s settings to choose an alternate version of your app icon. For example, a sports app might offer icons for different teams, letting someone choose their favorite. If you offer this capability, make sure each icon you design remains closely related to your content and experience. Avoid creating one someone might mistake for another app.

> [NOTE] Alternate app icons in iOS and iPadOS require their own dark, clear, and tinted variants. As with your default app icon, all alternate and variant icons are subject to app review and must adhere to the .


### Platform considerations

No additional considerations for iOS, iPadOS, or macOS.


#### tvOS

Include a safe zone to ensure the system doesn’t crop your content. When someone focuses your app icon, the system may crop content around the edges as the icon scales and moves. To ensure that your icon’s content is always visible, keep a safe zone around it. Be aware that the safe zone can vary, depending on the image size, layer depth, and motion, and the system crops foreground layers more than background layers.


#### visionOS

Avoid adding a shape that’s intended to look like a hole or concave area to the background layer. The system-added shadow and specular highlights can make such a shape stand out instead of recede.


#### watchOS

Avoid using black for your icon’s background. Lighten a black background so the icon doesn’t blend into the display background.


### Specifications

The layout, size, style, and appearances of app icons vary by platform.

The system automatically scales your icon to produce smaller variants that appear in certain locations, such as Settings and notifications.

App icons support the following color spaces:

- sRGB (color)

- Gray Gamma 2.2 (grayscale)

- Display P3 (wide-gamut color in iOS, iPadOS, macOS, tvOS, and watchOS only)


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## Branding

`/design/human-interface-guidelines/branding`

_Apps and games express their unique brand identity in ways that make them instantly recognizable while feeling at home on the platform and giving people a consistent experience._

In addition to expressing your brand in your  and throughout your experience, you have several opportunities to highlight it within the App Store. For guidance, see .


### Best practices

Use your brand’s unique voice and tone in all the written communication you display. For example, your brand might convey feelings of encouragement and optimism by using plain words, occasional exclamation marks and emoji, and simple sentence structures.

Consider choosing an accent color. On most platforms, you can specify a color that the system applies to app elements like interface icons, buttons, and text. In macOS, people can also choose their own accent color that the system can use in place of the color an app specifies. For guidance, see .

Consider using a custom font. If your brand is strongly associated with a specific font, be sure that it’s legible at all sizes and supports accessibility features like bold text and larger type. It can work well to use a custom font for headlines and subheadings while using a system font for body copy and captions, because the system fonts are designed for optimal legibility at small sizes. For guidance, see .

Ensure branding always defers to content. Using screen space for an element that does nothing but display a brand asset can mean there’s less room for the content people care about. Aim to incorporate branding in refined, unobtrusive ways that don’t distract people from your experience.

Help people feel comfortable by using standard patterns consistently. Even a highly stylized interface can be approachable if it maintains familiar behaviors. For example, place UI components in expected locations and use standard symbols to represent common actions.

Resist the temptation to display your logo throughout your app or game unless it’s essential for providing context. People seldom need to be reminded which app they’re using, and it’s usually better to use the space to give people valuable information and controls.

Avoid using a launch screen as a branding opportunity. Some platforms use a launch screen to minimize the startup experience, while simultaneously giving the app or game a little time to load resources (for guidance, see ). A launch screen disappears too quickly to convey any information, but you might consider displaying a welcome or onboarding screen that incorporates your branding content at the beginning of your experience. For guidance, see .

Follow Apple’s trademark guidelines. Apple trademarks must not appear in your app name or images. See  and .


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Videos

---

## Color

`/design/human-interface-guidelines/color`

_Judicious use of color can enhance communication, evoke your brand, provide visual continuity, communicate status and feedback, and help people understand information._

The system defines colors that look good on various backgrounds and appearance modes, and can automatically adapt to vibrancy and accessibility settings. Using system colors is a convenient way to make your experience feel at home on the device.

You may also want to use custom colors to enhance the visual experience of your app or game and express its unique personality. The following guidelines can help you use color in ways that people appreciate, regardless of whether you use system-defined or custom colors.


### Best practices

Avoid using the same color to mean different things. Use color consistently throughout your interface, especially when you use it to help communicate information like status or interactivity. For example, if you use your brand color to indicate that a borderless button is interactive, using the same or similar color to stylize noninteractive text is confusing.

Make sure all your app’s colors work well in light, dark, and increased contrast contexts. iOS, iPadOS, macOS, and tvOS offer both light and  appearance settings.  vary subtly depending on the system appearance, adjusting to ensure proper color differentiation and contrast for text, symbols, and other elements. With the Increase Contrast setting turned on, the color differences become far more apparent. When possible, use system colors, which already define variants for all these contexts. If you define a custom color, make sure to supply light and dark variants, and an increased contrast option for each variant that provides a significantly higher amount of visual differentiation. Even if your app ships in a single appearance mode, provide both light and dark colors to support Liquid Glass adaptivity in these contexts.

Test your app’s color scheme under a variety of lighting conditions. Colors can look different when you view your app outside on a sunny day or in dim light. In bright surroundings, colors look darker and more muted. In dark environments, colors appear bright and saturated. In visionOS, colors can look different depending on the colors of a wall or object in a person’s physical surroundings and how it reflects light. Adjust app colors to provide an optimal viewing experience in the majority of use cases.

Test your app on different devices. For example, the True Tone display — available on certain iPhone, iPad, and Mac models — uses ambient light sensors to automatically adjust the white point of the display to adapt to the lighting conditions of the current environment. Apps that primarily support reading, photos, video, and gaming can strengthen or weaken this effect by specifying a white point adaptivity style (for developer guidance, see ). Test tvOS apps on multiple brands of HD and 4K TVs, and with different display settings. You can also test the appearance of your app using different color profiles on a Mac — such as P3 and Standard RGB (sRGB) — by choosing a profile in System Settings > Displays. For guidance, see .

Consider how artwork and translucency affect nearby colors. Variations in artwork sometimes warrant changes to nearby colors to maintain visual continuity and prevent interface elements from becoming overpowering or underwhelming. Maps, for example, displays a light color scheme when in map mode but switches to a dark color scheme when in satellite mode. Colors can also appear different when placed behind or applied to a translucent element like a toolbar.

If your app lets people choose colors, prefer system-provided color controls where available. Using built-in color pickers provides a consistent user experience, in addition to letting people save a set of colors they can access from any app. For developer guidance, see .


### Inclusive color

Avoid relying solely on color to differentiate between objects, indicate interactivity, or communicate essential information. When you use color to convey information, be sure to provide the same information in alternative ways so people with color blindness or other visual disabilities can understand it. For example, you can use text labels or glyph shapes to identify objects or states.

Avoid using colors that make it hard to perceive content in your app. For example,  insufficient contrast can cause icons and text to blend with the background and make content hard to read, and people who are color blind might not be able to distinguish some color combinations. For guidance, see .

Consider how the colors you use might be perceived in other countries and cultures. For example, red communicates danger in some cultures, but has positive connotations in other cultures. Make sure the colors in your app send the message you intend.


### System colors

Avoid hard-coding system color values in your app. Documented color values are for your reference during the app design process. The actual color values may fluctuate from release to release, based on a variety of environmental variables. Use APIs like  to apply system colors.

iOS, iPadOS, macOS, and visionOS also define sets of dynamic system colors that match the color schemes of standard UI components and automatically adapt to both light and dark contexts. Each dynamic color is semantically defined by its purpose, rather than its appearance or color values. For example, some colors represent view backgrounds at different levels of hierarchy and other colors represent foreground content, such as labels, links, and separators.

Avoid redefining the semantic meanings of dynamic system colors. To ensure a consistent experience and ensure your interface looks great when the appearance of the platform changes, use dynamic system colors as intended. For example, don’t use the  color as a text color, or  color as a background color.


### Liquid Glass color

By default,  has no inherent color, and instead takes on colors from the content directly behind it. You can apply color to some Liquid Glass elements, giving them the appearance of colored or stained glass. This is useful for drawing emphasis to a specific control, like a primary call to action, and is the approach the system uses for prominent button styling. Symbols or text labels on Liquid Glass controls can also have color.

For smaller elements like toolbars and tab bars, the system can adapt Liquid Glass between a light and dark appearance in response to the underlying content. By default, symbols and text on these elements follow a monochromatic color scheme, becoming darker when the underlying content is light, and lighter when it’s dark. Liquid Glass appears more opaque in larger elements like sidebars to preserve legibility over complex backgrounds and accommodate richer content on the material’s surface.

Apply color sparingly to the Liquid Glass material, and to symbols or text on the material. If you apply color, reserve it for elements that truly benefit from emphasis, such as status indicators or primary actions. To emphasize primary actions, apply color to the background rather than to symbols or text. For example, the system applies the app accent color to the background in prominent buttons — such as the Done button — to draw attention and elevate their visual prominence. Refrain from adding color to the background of multiple controls.

Avoid using similar colors in control labels if your app has a colorful background. While color can make apps more visually appealing, playful, or reflective of your brand, too much color can be overwhelming and make control labels more difficult to read. If your app features colorful backgrounds or visually rich content, prefer a monochromatic appearance for toolbars and tab bars, or choose an accent color with sufficient visual differentiation. By contrast, in apps with primarily monochromatic content or backgrounds, choosing your brand color as the app accent color can be an effective way to tailor your app experience and reflect your company’s identity.

Be aware of the placement of color in the content layer. Make sure your interface maintains sufficient contrast by avoiding overlap of similar colors in the content layer and controls when possible. Although colorful content might intermittently scroll underneath controls, make sure its default or resting state — like the top of a screen of scrollable content — maintains clear legibility.


### Color management

A color space represents the colors in a color model like RGB or CMYK. Common color spaces — sometimes called gamuts — are sRGB and Display P3.

A color profile describes the colors in a color space using, for example, mathematical formulas or tables of data that map colors to numerical representations. An image embeds its color profile so that a device can interpret the image’s colors correctly and reproduce them on a display.

Apply color profiles to your images. Color profiles help ensure that your app’s colors appear as intended on different displays. The sRGB color space produces accurate colors on most displays.

Use wide color to enhance the visual experience on compatible displays. Wide color displays support a P3 color space, which can produce richer, more saturated colors than sRGB. As a result, photos and videos that use wide color are more lifelike, and visual data and status indicators that use wide color can be more meaningful. When appropriate, use the Display P3 color profile at 16 bits per pixel (per channel) and export images in PNG format. Note that you need to use a wide color display to design wide color images and select P3 colors.

Provide color space–specific image and color variations if necessary. In general, P3 colors and images appear fine on sRGB displays. Occasionally, it may be hard to distinguish two very similar P3 colors when viewing them on an sRGB display. Gradients that use P3 colors can also sometimes appear clipped on sRGB displays. To avoid these issues and to ensure visual fidelity on both wide color and sRGB displays, you can use the asset catalog of your Xcode project to provide different versions of images and colors for each color space.


### Platform considerations


#### iOS, iPadOS

iOS defines two sets of dynamic background colors — system and grouped — each of which contains primary, secondary, and tertiary variants that help you convey a hierarchy of information. In general, use the grouped background colors (, , and ) when you have a grouped table view; otherwise, use the system set of background colors (, , and ).

With both sets of background colors, you generally use the variants to indicate hierarchy in the following ways:

- Primary for the overall view

- Secondary for grouping content or elements within the overall view

- Tertiary for grouping content or elements within secondary elements

For foreground content, iOS defines the following dynamic colors:


#### macOS

macOS defines the following dynamic system colors (you can also view them in the Developer palette of the standard Color panel):


##### App accent colors

Beginning in macOS 11, you can specify an accent color to customize the appearance of your app’s buttons, selection highlighting, and sidebar icons. The system applies your accent color when the current value in General > Accent color settings is multicolor.

If people set their accent color setting to a value other than multicolor, the system applies their chosen color to the relevant items throughout your app, replacing your accent color. The exception is a sidebar icon that uses a fixed color you specify. Because a fixed-color sidebar icon uses a specific color to provide meaning, the system doesn’t override its color when people change the value of accent color settings. For guidance, see .


#### tvOS

Consider choosing a limited color palette that coordinates with your app logo. Subtle use of color can help you communicate your brand while deferring to the content.

Avoid using only color to indicate focus. Subtle scaling and responsive animation are the primary ways to denote interactivity when an element is in focus.


#### visionOS

Use color sparingly, especially on glass. Standard visionOS windows typically use the system-defined glass , which lets light and objects from people’s physical surroundings and their space show through. Because the colors in these physical and virtual objects are visible through the glass, they can affect the legibility of colorful app content in the window. Prefer using color in places where it can help call attention to important information or show the relationship between parts of the interface.

Prefer using color in bold text and large areas. Color in lightweight text or small areas can make them harder to see and understand.

In a fully immersive experience, help people maintain visual comfort by keeping brightness levels balanced. Although using high contrast can help direct people’s attention to important content, it can also cause visual discomfort if people’s eyes have adjusted to low light or darkness. Consider making content fully bright only when the rest of the visual context is also bright. For example, avoid displaying a bright object on a very dark or black background, especially if the object flashes or moves.


#### watchOS

Use background color to support existing content or supply additional information. Background color can establish a sense of place and help people recognize key content. For example, in Activity, each infographic view for the Move, Exercise, and Stand Activity rings has a background that matches the color of the ring. Use background color when you have something to communicate, rather than as a solely visual flourish. Avoid using full-screen background color in views that are likely to remain onscreen for long periods of time, such as in a workout or audio-playing app.

Recognize that people might prefer graphic complications to use tinted mode instead of full color. The system can use a single color that’s based on the wearer’s selected color in a graphic complication’s images, gauges, and text. For guidance, see .


### Specifications


#### System colors

visionOS system colors use the default dark color values.


#### iOS, iPadOS system gray colors

In SwiftUI, the equivalent of `systemGray` is .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Dark Mode

`/design/human-interface-guidelines/dark-mode`

_Dark Mode is a systemwide appearance setting that uses a dark color palette to provide a comfortable viewing experience tailored for low-light environments._

In iOS, iPadOS, macOS, and tvOS, people often choose Dark Mode as their default interface style, and they generally expect all apps and games to respect their preference. In Dark Mode, the system uses a dark color palette for all screens, views, menus, and controls, and may also use greater perceptual contrast to make foreground content stand out against the darker backgrounds.


### Best practices

Avoid offering an app-specific appearance setting. An app-specific appearance mode option creates more work for people because they have to adjust more than one setting to get the appearance they want. Worse, they may think your app is broken because it doesn’t respond to their systemwide appearance choice.

Ensure that your app looks good in both appearance modes. In addition to using one mode or the other, people can choose the Auto appearance setting, which switches between the light and dark appearances as conditions change throughout the day, potentially while your app is running.

Test your content to make sure that it remains comfortably legible in both appearance modes. For example, in Dark Mode with Increase Contrast and Reduce Transparency turned on (both separately and together), you may find places where dark text is less legible when it’s on a dark background. You might also find that turning on Increase Contrast in Dark Mode can result in reduced visual contrast between dark text and a dark background. Although people with strong vision might still be able to read lower contrast text, such text could be illegible for many. For guidance, see .

In rare cases, consider using only a dark appearance in the interface. For example, it can make sense for an app that supports immersive media viewing to use a permanently dark appearance that lets the UI recede and helps people focus on the media.


### Dark Mode colors

The color palette in Dark Mode includes dimmer background colors and brighter foreground colors. It’s important to realize that these colors aren’t necessarily inversions of their light counterparts: while many colors are inverted, some are not. For more information, see .

Embrace colors that adapt to the current appearance. Semantic colors (like  and  in macOS or  in iOS and iPadOS) automatically adapt to the current appearance. When you need a custom color, add a Color Set asset to your app’s asset catalog in Xcode, and specify the bright and dim variants of the color. Avoid using hard-coded color values or colors that don’t adapt.

Aim for sufficient color contrast in all appearances. Using system-defined colors can help you achieve a good contrast ratio between your foreground and background content. At a minimum, make sure the contrast ratio between colors is no lower than 4.5:1. For custom foreground and background colors, strive for a contrast ratio of 7:1, especially in small text. This ratio ensures that your foreground content stands out from the background, and helps your content meet recommended accessibility guidelines.

Soften the color of white backgrounds. If you display a content image that includes a white background, consider slightly darkening the image to prevent the background from glowing in the surrounding Dark Mode context.


#### Icons and images

The system uses  (which automatically adapt to Dark Mode) and full-color images that are optimized for both the light and dark appearances.

Use SF Symbols wherever possible. Symbols work well in both appearance modes when you use dynamic colors to tint them or when you add vibrancy. For guidance, see .

Design separate interface icons for the light and dark appearances if necessary. For example, an icon that depicts a full moon might need a subtle dark outline to contrast well with a light background, but need no outline when it displays on a dark background. Similarly, an icon that represents a drop of oil might need a slight border to make the edge visible against a dark background.

Make sure full-color images and icons look good in both appearances. Use the same asset if it looks good in both the light and dark appearances. If an asset looks good in only one mode, modify the asset or create separate light and dark assets. Use asset catalogs to combine your assets into a single named image.


#### Text

The system uses vibrancy and increased contrast to maintain the legibility of text on darker backgrounds.

Use the system-provided label colors for labels. The primary, secondary, tertiary, and quaternary label colors adapt automatically to the light and dark appearances.

Use system views to draw text fields and text views. System views and controls make your app’s text look good on all backgrounds, adjusting automatically for the presence or absence of vibrancy. When possible, use a system-provided view to display text instead of drawing the text yourself.


### Platform considerations

No additional considerations for tvOS. Dark Mode isn’t supported in visionOS or watchOS.


#### iOS, iPadOS

In Dark Mode, the system uses two sets of background colors — called base and elevated — to enhance the perception of depth when one dark interface is layered above another. The base colors are dimmer, making background interfaces appear to recede, and the elevated colors are brighter, making foreground interfaces appear to advance.

Prefer the system background colors. Dark Mode is dynamic, which means that the background color automatically changes from base to elevated when an interface is in the foreground, such as a popover or modal sheet. The system also uses the elevated background color to provide visual separation between apps in a multitasking environment and between windows in a multiple-window context. Using a custom background color can make it harder for people to perceive these system-provided visual distinctions.


#### macOS

When people choose the graphite accent color in General settings, macOS causes window backgrounds to pick up color from the current desktop picture. The result — called desktop tinting — is a subtle effect that helps windows blend more harmoniously with their surrounding content.

Include some transparency in custom component backgrounds when appropriate. Transparency lets your components pick up color from the window background when desktop tinting is active, creating a visual harmony that can persist even when the desktop picture changes. To help achieve this harmony, add transparency only to a custom component that has a visible background or bezel, and only when the component is in a neutral state, such as state that doesn’t use color. You don’t want to add transparency when the component is in a state that uses color, because doing so can cause the component’s color to fluctuate when the window background adjusts to a different location on the desktop or when the desktop picture changes.


### Resources


##### Related


##### Videos


### Change log

---

## Icons

`/design/human-interface-guidelines/icons`

_An effective icon is a graphic asset that expresses a single concept in ways people instantly understand._

Apps and games use a variety of simple icons to help people understand the items, actions, and modes they can choose. Unlike , which can use rich visual details like shading, texturing, and highlighting to evoke the app’s personality, an interface icon typically uses streamlined shapes and touches of color to communicate a straightforward idea.

You can design interface icons — also called glyphs — or you can choose symbols from the SF Symbols app, using them as-is or customizing them to suit your needs. Both interface icons and symbols use black and clear colors to define their shapes; the system can apply other colors to the black areas in each image. For guidance, see .


### Best practices

Create a recognizable, highly simplified design. Too many details can make an interface icon confusing or unreadable. Strive for a simple, universal design that most people will recognize quickly. In general, icons work best when they use familiar visual metaphors that are directly related to the actions they initiate or content they represent.

Maintain visual consistency across all interface icons in your app. Whether you use only custom icons or mix custom and system-provided ones, all interface icons in your app need to use a consistent size, level of detail, stroke thickness (or weight), and perspective. Depending on the visual weight of an icon, you may need to adjust its dimensions to ensure that it appears visually consistent with other icons.

In general, match the weights of interface icons and adjacent text. Unless you want to emphasize either the icons or the text, using the same weight for both gives your content a consistent appearance and level of emphasis.

If necessary, add padding to a custom interface icon to achieve optical alignment. Some icons — especially asymmetric ones — can look unbalanced when you center them geometrically instead of optically. For example, the download icon shown below has more visual weight on the bottom than on the top, which can make it look too low if it’s geometrically centered.

In such cases, you can slightly adjust the position of the icon until it’s optically centered. When you create an asset that includes your adjustments as padding around an interface icon (as shown below on the right), you can optically center the icon by geometrically centering the asset.

Adjustments for optical centering are typically very small, but they can have a big impact on your app’s appearance.

Provide a selected-state version of an interface icon only if necessary. You don’t need to provide selected and unselected appearances for an icon that’s used in standard system components such as toolbars, tab bars, and buttons. The system updates the visual appearance of the selected state automatically.

Use inclusive images. Consider how your icons can be understandable and welcoming to everyone. Prefer depicting gender-neutral human figures and avoid images that might be hard to recognize across different cultures or languages. For guidance, see .

Include text in your design only when it’s essential for conveying meaning. For example, using a character in an interface icon that represents text formatting can be the most direct way to communicate the concept. If you need to display individual characters in your icon, be sure to localize them. If you need to suggest a passage of text, design an abstract representation of it, and include a flipped version of the icon to use when the context is right-to-left. For guidance, see .

If you create a custom interface icon, use a vector format like PDF or SVG. The system automatically scales a vector-based interface icon for high-resolution displays, so you don’t need to provide high-resolution versions of it. In contrast, PNG — used for app icons and other images that include effects like shading, textures, and highlighting — doesn’t support scaling, so you have to supply multiple versions for each PNG-based interface icon. Alternatively, you can create a custom SF Symbol and specify a scale that ensures the symbol’s emphasis matches adjacent text. For guidance, see .

Provide alternative text labels for custom interface icons. Alternative text labels — or accessibility descriptions — aren’t visible, but they let VoiceOver audibly describe what’s onscreen, simplifying navigation for people with visual disabilities. For guidance, see .

Avoid using replicas of Apple hardware products. Hardware designs tend to change frequently and can make your interface icons and other content appear dated. If you must display Apple hardware, use only the images available in  or the SF Symbols that represent various Apple products.


### Standard icons

For icons to represent common actions in , , , and other places in interfaces across Apple platforms, you can use these .


#### Editing


#### Selection


#### Text formatting


#### Search


#### Sharing and exporting


#### Users and accounts


#### Ratings


#### Layer ordering


#### Other


### Platform considerations

No additional considerations for iOS, iPadOS, tvOS, visionOS, or watchOS.


#### macOS


##### Document icons

If your macOS app can use a custom document type, you can create a document icon to represent it. Traditionally, a document icon looks like a piece of paper with its top-right corner folded down. This distinctive appearance helps people distinguish documents from apps and other content, even when icon sizes are small.

If you don’t supply a document icon for a file type you support, macOS creates one for you by compositing your app icon and the file’s extension onto the canvas. For example, Preview uses a system-generated document icon to represent JPG files.

In some cases, it can make sense to create a set of document icons to represent a range of file types your app handles. For example, Xcode uses custom document icons to help people distinguish projects, AR objects, and Swift code files.

To create a custom document icon, you can supply any combination of background fill, center image, and text. The system layers, positions, and masks these elements as needed and composites them onto the familiar folded-corner icon shape.

 provides a template you can use to create a custom background fill and center image for a document icon. As you use this template, follow the guidelines below.

Design simple images that clearly communicate the document type. Whether you use a background fill, a center image, or both, prefer uncomplicated shapes and a reduced palette of distinct colors. Your document icon can display as small as 16x16 px, so you want to create designs that remain recognizable at every size.

Designing a single, expressive image for the background fill can be a great way to help people understand and recognize a document type. For example, Xcode and TextEdit both use rich background images that don’t include a center image.

Consider reducing complexity in the small versions of your document icon. Icon details that are clear in large versions can look blurry and be hard to recognize in small versions. For example, to ensure that the grid lines in the custom heart document icon remain clear in intermediate sizes, you might use fewer lines and thicken them by aligning them to the reduced pixel grid. In the 16x16 px size, you might remove the lines altogether.

Avoid placing important content in the top-right corner of your background fill. The system automatically masks your image to fit the document icon shape and draws the white folded corner on top of the fill. Create a set of background images in the sizes listed below.

- 512x512 px @1x, 1024x1024 px @2x

- 256x256 px @1x, 512x512 px @2x

- 128x128 px @1x, 256x256 px @2x

- 32x32 px @1x, 64x64 px @2x

- 16x16 px @1x, 32x32 px @2x

If a familiar object can convey a document’s type or its connection with your app, consider creating a center image that depicts it. Design a simple, unambiguous image that’s clear and recognizable at every size. The center image measures half the size of the overall document icon canvas. For example, to create a center image for a 32x32 px document icon, use an image canvas that measures 16x16 px. You can provide center images in the following sizes:

- 256x256 px @1x, 512x512 px @2x

- 128x128 px @1x, 256x256 px @2x

- 32x32 px @1x, 64x64 px @2x

- 16x16 px @1x, 32x32 px @2x

Define a margin that measures about 10% of the image canvas and keep most of the image within it. Although parts of the image can extend into this margin for optical alignment, it’s best when the image occupies about 80% of the image canvas. For example, most of the center image in a 256x256 px canvas would fit in an area that measures 205x205 px.

Specify a succinct term if it helps people understand your document type. By default, the system displays a document’s extension at the bottom edge of the document icon, but if the extension is unfamiliar you can supply a more descriptive term. For example, the document icon for a SceneKit scene file uses the term scene instead of the file extension scn. The system automatically scales the extension text to fit in the document icon, so be sure to use a term that’s short enough to be legible at small sizes. By default, the system capitalizes every letter in the text.


### Resources


##### Related


##### Videos


### Change log

---

## Images

`/design/human-interface-guidelines/images`

_To make sure your artwork looks great on all devices you support, learn how the system displays content and how to deliver art at the appropriate scale factors._


### Resolution

Different devices can display images at different resolutions. For example, a 2D device displays images according to the resolution of its screen.

A point is an abstract unit of measurement that helps visual content remain consistent regardless of how it’s displayed. In 2D platforms, a point maps to a number of pixels that can vary according to the resolution of the display; in visionOS, a point is an angular value that allows visual content to scale according to its distance from the viewer.

When creating bitmap images, you specify a scale factor which determines the resolution of an image. You can visualize scale factor by considering the density of pixels per point in 2D displays of various resolutions. For example, a scale factor of 1 (also called @1x) describes a 1:1 pixel density, where one pixel is equal to one point. High-resolution 2D displays have higher pixel densities, such as 2:1 or 3:1. A 2:1 density (called @2x) has a scale factor of 2, and a 3:1 density (called @3x) has a scale factor of 3. Because of higher pixel densities, high-resolution displays demand images with more pixels.

Provide high-resolution assets for all bitmap images in your app, for every device you support. As you add each image to your project’s asset catalog, identify its scale factor by appending “@1x,” “@2x,” or “@3x” to its filename. Use the following values for guidance; for additional scale factors, see .

In general, design images at the lowest resolution and scale them up to create high-resolution assets. When you use resizable vectorized shapes, you might want to position control points at whole values so that they’re cleanly aligned at 1x. This positioning allows the points to remain cleanly aligned to the raster grid at higher resolutions, because 2x and 3x are multiples of 1x.


### Formats

As you create different types of images, consider the following recommendations.


### Best practices

Include a color profile with each image. Color profiles help ensure that your app’s colors appear as intended on different displays. For guidance, see .

Always test images on a range of actual devices. An image that looks great at design time may appear pixelated, stretched, or compressed when viewed on various devices.


### Platform considerations

No additional considerations for iOS, iPadOS, or macOS.


#### tvOS

Layered images are at the heart of the Apple TV user experience. The system combines layered images, transparency, scaling, and motion to produce a sense of realism and vigor that evokes a personal connection as people interact with onscreen content.


##### Parallax effect

Parallax is a subtle visual effect the system uses to convey depth and dynamism when an element is in focus. As an element comes into focus, the system elevates it to the foreground, gently swaying it while applying illumination that makes the element’s surface appear to shine. After a period of inactivity, out-of-focus content dims and the focused element expands.

Layered images are required to support the parallax effect.


##### Layered images

A layered image consists of two to five distinct layers that come together to form a single image. The separation between layers, along with use of transparency, creates a feeling of depth. As someone interacts with an image, layers closer to the surface elevate and scale, overlapping lower layers farther back and producing a 3D effect.

> [IMPORTANT] Your tvOS  must use a layered image. For other focusable images in your app, including  images, layered images are strongly encouraged, but optional.

You can embed layered images in your app or retrieve them from a content server at runtime. For guidance on adding layered images to your app, see the .

> [NOTE] If your app retrieves layered images from a content server at runtime, you must provide runtime layered images (`.lcr`). You can generate them from LSR files or Photoshop files using the `layerutil` command-line tool that Xcode provides. Runtime layered images are intended to be downloaded — don’t embed them in your app.

Use standard interface elements to display layered images. If you use standard views and system-provided focus APIs — such as  — layered images automatically get the parallax treatment when people bring them into focus.

Identify logical foreground, middle, and background elements. In foreground layers, display prominent elements like a character in a game, or text on an album cover or movie poster. Middle layers are perfect for secondary content and effects like shadows. Background layers are opaque backdrops that showcase the foreground and middle layers without upstaging them.

Generally, keep text in the foreground. Unless you want to obscure text, bring it to the foreground layer for clarity.

Keep the background layer opaque. Using varying levels of opacity to let content shine through higher layers is fine, but your background layer must be opaque — you’ll get an error if it’s not. An opaque background layer ensures your artwork looks great with parallax, drop shadows, and system backgrounds.

Keep layering simple and subtle. Parallax is designed to be almost unnoticeable. Excessive 3D effects can appear unrealistic and jarring. Keep depth simple to bring your content to life and add delight.

Leave a safe zone around the foreground layers of your image. When focused, content on some layers may be cropped as the layered image scales and moves. To ensure that essential content is always visible, keep it within a safe zone. For guidance, see .

Always preview layered images. To ensure your layered images look great on Apple TV, preview them throughout your design process using Xcode, the Parallax Previewer app for macOS, or the Parallax Exporter plug-in for Adobe Photoshop. Pay special attention as scaling and clipping occur, and readjust your images as needed to keep important content safe. After your layered images are final, preview them on an actual TV for the most accurate representation of what people will see. To download Parallax Previewer and Parallax Exporter, see .


#### visionOS

In visionOS, people can view images at a much larger range of sizes than in any other platform, and the system dynamically scales the image resolution to match the current size. Because you can position images at specific angles within someone’s surroundings, image pixels may not line up 1:1 with screen pixels.

Create a layered app icon. App icons in visionOS are composed of two to three layers that provide the appearance of depth by moving at subtly different rates when the icon is in focus. For guidance, see .

Prefer vector-based art for 2D images. Avoid bitmap content because it might not look good when the system scales it up. If you use Core Animation layers, see  for developer guidance.

If you need to use rasterized images, balance quality with performance as you choose a resolution. Although a @2x image looks fine at common viewing distances, its fixed resolution means that the system doesn’t dynamically scale it and it might not look sharp from close up. To help a rasterized image look sharp when people view it from a wide range of distances, you can use a higher resolution, but each increase in resolution results in a larger file size and may impact your app’s runtime performance, especially for resolutions over @6x. If you use images that have resolutions higher than @2x, be sure to also apply high-quality image filtering to help balance quality and performance (for developer guidance, see ).


##### Spatial photos and spatial scenes

In addition to 2D and stereoscopic images, visionOS apps and games can use RealityKit to display spatial photos and spatial scenes. A spatial photo is a stereoscopic photo with additional spatial metadata, as captured on iPhone 15 Pro or later, Apple Vision Pro, or other compatible camera. A spatial scene is a 3D image generated from a 2D image to add a parallax effect that responds to head movement. For developer guidance, see .

Make sure spatial photos render correctly in your app. Use the stereo High-Efficiency Image Codec (HEIC) format to display a spatial photo in your app. When you add spatial metadata to a stereo HEIC, visionOS recognizes the photo as spatial and includes visual treatments that help minimize common causes of stereo-viewing discomfort.

Prefer the feathered glass background effect to display text over spatial photos. If you need to place text over a spatial photo in your app or game, use the feathered glass background effect. The effect adds contrast to make the text readable, and it blurs out detail to help reduce visual discomfort when people view text over spatial photos. For developer guidance, see .

Take visual comfort into consideration when you make spatial photos from existing 2D content. When adjusting the spatial metadata of a photo for your app or game, consider how you want people to view your content. Metadata like disparity adjustment can alter how people perceive the 3D scene, and can cause visual discomfort from certain viewing positions. For developer guidance, see .

Display spatial photos and spatial scenes in standalone views. Avoid displaying spatial photos inline with other content, as this can cause visual discomfort. Instead, showcase spatial photos or spatial scenes in a separate view, like a sheet or window. If you must display stereoscopic images inline, provide generous spacing between the image and any inline content to help people’s eyes adjust to the depth changes.

Use spatial scenes in your app for specific moments. Each spatial scene can take up to several seconds to generate from an existing image. Design experiences with this limitation in mind. For instance, the Photos app offers an explicit action to create a spatial scene while immersed in a single photo. Avoid displaying too many spatial scenes at once. Instead, use scroll views, pagination, or explicit actions to move to new photos and keep the visual information hierarchy simple.

When displaying immersively, prefer minimal UI. For example, the Spatial Gallery app displays a single piece of content with a small caption and a single Back button, relying on swipe gestures to navigate between items.

Prefer displaying larger spatial scenes that you center in someone’s field of view. When people view a spatial scene, they may move their head laterally to view the parallax effect. Smaller spatial scenes provide less of a parallax effect and may not be as impactful to viewers.


#### watchOS

In general, avoid transparency to keep image files small. If you always composite an image on the same solid background color, it’s more efficient to include the background in the image. However, transparency is necessary in complication images, menu icons, and other interface icons that serve as template images, because the system uses it to determine where to apply color.

Use autoscaling PDFs to let you provide a single asset for all screen sizes. Design your image for the 40mm and 42mm screens at 2x. When you load the PDF, WatchKit automatically scales the image based on the device’s screen size, using the values shown below:


### Resources


##### Related


##### Developer documentation

 — visionOS

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Inclusion

`/design/human-interface-guidelines/inclusion`

_Inclusive apps and games put people first by prioritizing respectful communication and presenting content and functionality in ways that everyone can access and understand._

To help you design an inclusive app or game, consider the following goals as you review the words and images you use and the experiences you offer.

As with all design, designing an inclusive app is an iterative process that takes time to get right. Throughout the process, be prepared to examine your assumptions about how other people think and feel and be open to evolving knowledge and understanding.


### Inclusive by design

Simple, intuitive experiences are at the core of well-designed apps and games. To design an intuitive experience, you start by investigating people’s goals and perspectives so you can present content that resonates with them.

Empathy is an important tool in this investigation because it helps you understand how people with different perspectives might respond to the content and experiences you create. For example, you might discover that from some perspectives a word or image is incomprehensible or has a meaning you don’t intend.

Although each person’s perspective comprises a unique intersection of human qualities that’s both distinct and dynamic, all perspectives arise from human characteristics and experiences that everyone shares, including:

- Age

- Gender and gender identity

- Race and ethnicity

- Sexuality

- Physical attributes

- Cognitive attributes

- Permanent, temporary, and situational disabilities

- Language and culture

- Religion

- Education

- Political or philosophical opinions

- Social and economic context

As you examine your app or game through different perspectives, avoid framing the work as merely a search for content that might give offense. Although no design should contain offensive material or experiences, an inoffensive app or game isn’t necessarily an inclusive one. Focusing on inclusion can help you avoid potentially offensive content while also helping you create a welcoming experience that everyone can enjoy.


### Welcoming language

Using plain, inclusive language welcomes everyone and helps them understand your app or game. Carefully review the writing in your experience to make sure that your tone and words don’t exclude people. Here are a few tips for writing text — also known as copy — that’s direct, easy to understand, and inclusive.

Consider the tone of your copy from different perspectives. The style of your writing communicates almost as much as the words you use. Although different apps use different communication styles, make sure the tone you use doesn’t send messages you don’t intend. For example, an academic tone can make an app or game seem like it welcomes only high levels of education. As you seek the style that’s right for your experience, be clear, direct, and respectful.

Pay attention to how you refer to people. It typically works well to use you and your to address people directly. Referring to people indirectly as the user or the player can make your experience feel distant and unwelcoming. Also, consider reserving words like we and our to represent your software or company; otherwise, these terms can suggest a personal relationship with people that might be interpreted as insulting or condescending.

Avoid using specialized or technical terms without defining them. Using specialized or technical terms can make your writing more succinct, but doing so excludes people who don’t know what the terms mean. If you must use such terms, be sure to define them first and make the definitions easy for people to look up. Even when people know the definition of a specialized or technical term in a sentence, the sentence is easier to read — and translate — when it uses plain language instead.

Replace colloquial expressions with plain language. Colloquial expressions are often culture-specific and can be difficult to translate. Worse, some colloquial phrases have exclusionary meanings you might not know. For example, the phrases peanut gallery and grandfathered in both arose from oppressive contexts and continue to exclude people. Even when a colloquial phrase doesn’t have an exclusionary meaning, it can still exclude everyone who doesn’t understand it.

Consider carefully before including humor. Humor is highly subjective and — similar to colloquial expressions — difficult to translate from one culture to another. Including humor in your experience risks confusing people who donʼt understand it, irritating people who tire of repeatedly encountering it, and insulting people who interpret it differently. For additional writing guidance, see .


### Being approachable

An approachable app or game doesn’t require people to have particular skills or knowledge before they can use it, and it gives people a clear path toward deepening their understanding over time. Here are two ways to help make an experience approachable.

- Present a clear, straightforward interface. To help you design a simple interface that fits in with other experiences on each platform, see , , ,  , , , and .

- Build in ways to learn how to use your app or game. Consider designing an onboarding flow that helps people who are new to your experience take a step-by-step approach while letting others skip straight to the content they want. For guidance, see .


### Gender identity

Throughout history, cultures around the world have recognized a spectrum of self-identity and expression that expands beyond the binary variants of woman and man.

You can help everyone feel welcome in your app or game by avoiding unnecessary references to specific genders. For example, a recipe-sharing app that uses copy like “You can let a subscriber post his or her recipes to your shared folder” could avoid unnecessary gender references by using an alternative like “Subscribers can post recipes to your shared folder.” In addition to using the gender-neutral noun “subscribers,” the revised copy avoids the unnecessary singular pronouns “his” and “her,” helping the sentence remain inclusive when it’s localized for languages that use gendered pronouns.

In addition, you can often avoid referencing a specific gender in an avatar, emoji, glyph, or game character. To welcome everyone to your app or game, prefer giving people the tools they need to customize such items as they choose.

If you need to depict a generic person or people, use a nongendered human image to reinforce the message that generic person means human, not man or woman. SF Symbols provides many nongendered glyphs you can use, such as the figure and person symbols shown here:

Most apps and games don’t need to know a person’s gender, but if you require this information — such as for health or legal reasons — consider providing inclusive options, such as nonbinary, self-identify, and decline to state. In this situation, you could also let people specify the pronouns they use so you can address them properly when necessary.


### People and settings

Portraying human diversity is one of the most noticeable ways your app or game can welcome everyone. When people recognize others like themselves within an experience and its related materials, they’re less likely to feel excluded and can be more likely to think they’ll benefit from it.

As you create copy and images that represent people, portray a range of human characteristics and activities. For example, a fitness app could feature exercise moves demonstrated by people with different racial backgrounds, body types, ages, and physical capabilities. If you need to depict occupations or behaviors, avoid stereotypical representations, such as showing only male doctors, female nurses, or heroes and villains that may perpetuate real-world racial or gender stereotypes.

Also review the settings and objects you show. For example, showing high levels of affluence might make sense in some scenarios, but in other cases it can be unwelcoming and make an experience seem out of touch. When it makes sense in your app or game, prefer showing places, homes, activities, and items that are familiar and relatable to most people.


### Avoiding stereotypes

Everyone holds biases and stereotypes — often unconsciously — and it can be challenging to discover how they affect your thoughts. A goal of inclusive design is to become aware of your biases and generalizations so you can recognize where they might influence your design decisions.

For example, consider an app that helps people manage account access for various family members. If this app uses a stereotypical definition of family — such as a woman, a man, and their biological children — it’s likely to communicate this perspective in its copy and images. Because the app assumes that people’s families fit this narrow definition, it excludes everyone whose family is different.

Although the assumption made in the account-access app might seem like an obvious mistake, it’s important to realize that not all assumptions are so easy to spot. For example, consider an app or game that requires people to choose security questions they can answer for future identity confirmation, such as:

- What was your favorite subject in college?

- What was the make of your first car?

- How did you feel when you first saw a rainbow?

From some perspectives these questions refer to commonplace events, but all are based on experiences that not everyone has. Using a context-specific experience to communicate something is useless for everyone who doesn’t share that context and effectively excludes them. To create alternatives to the culture- and capability-specific questions above, you might reference more universal human experiences like:

- What’s your favorite activity?

- What was the name of your first friend?

- What quality describes you best?

Basing design decisions on stereotypes or assumptions inevitably leads to exclusion because generalizations can’t reflect the diversity of human perspectives. Avoiding assumptions and instead concentrating on inclusion can help you craft experiences that benefit everyone.


### Accessibility

An inclusive app or game is accessible to everyone. People rely on Apple’s accessibility features — such as VoiceOver, Display Accommodations, closed captioning, Switch Control, and Speak Screen — to customize their devices for their individual needs, so it’s essential to support these features.

It’s also essential to avoid assuming that any disability might prevent someone from wanting to enjoy the experience your software provides. Making an assumption like this can result in designs that limit the potential audience for your app or game. In contrast, when you make each experience accessible, you give everyone the opportunity to benefit from your app or game in ways that work for them.

To help you design an app or game that everyone can enjoy, remember that:

- Each disability is a spectrum. For example, visual disabilities range from low vision to complete blindness, and include things like color blindness, blurry vision, light sensitivity, and peripheral vision loss.

- Everyone can experience disabilities. In addition to disabilities that most people experience as they age, there are temporary disabilities — like short-term hearing loss due to an infection — and situational disabilities — like being unable to hear while on a noisy train — that can affect everyone at various times.

As you design content that welcomes people of all abilities, consider the following tips.

Avoid images and language that exclude people with disabilities. For example, include people with disabilities when you represent a variety of people, and avoid language that uses a disability to express a negative quality.

Take a people-first approach when writing about people with disabilities. For example, you could describe an individual’s accomplishments and goals before mentioning a disability they may have. If you’re writing about a specific person or community, find out how they self-identify; for more guidance, see .

Prioritize simplicity and perceivability. Prefer familiar, consistent interactions that make tasks simple to perform, and ensure that everyone can perceive your content, whether they use sight, hearing, or touch.

To learn more about making your app or game accessible, see .


### Languages

People expect to customize their device by choosing a language for text and a region for formatting values like date, time, and money. To welcome a global audience, first prepare your software to handle languages and regions other than your own — a process called internationalization — and provide translated text and resources for specific locales. For an overview of internationalization, see ; for developer guidance on localization, see .

Creating an inclusive experience can also help you prepare for localization. For example, using plain language, avoiding unnecessary gender references, representing a variety of people, and avoiding stereotypes and culture-specific content, can put you in a good position to create versions of your software localized into more languages. Using  for the glyphs in your app or game can also help streamline localization. In addition to providing many language-specific glyphs, SF Symbols includes glyphs you can use in both left-to-right and right-to-left contexts; for guidance, see .

As you localize your app or game and related content, also be aware of the ways you use color. Colors often have strong culture-specific meanings, so it’s essential to discover how people respond to specific colors in each locale you support. In some places, for example, white is associated with death or grief, whereas in other places, it’s associated with purity or peace. If you use color as a way to communicate, make sure your color choices communicate the same thing in each version of your software.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — Xcode


##### Videos

---

## Layout

`/design/human-interface-guidelines/layout`

_A consistent layout that adapts to various contexts makes your experience more approachable and helps people enjoy their favorite apps and games on all their devices._

Your app’s layout helps ground people in your content from the moment they open it. People expect familiar relationships between controls and content to help them use and discover your app’s features, and designing the layout to take advantage of this makes your app feel at home on the platform.

Apple provides templates, guides, and other resources that can help you integrate Apple technologies and design your apps and games to run on all Apple platforms. See .


### Best practices

Group related items to help people find the information they want. For example, you might use negative space, background shapes, colors, materials, or separator lines to show when elements are related and to separate information into distinct areas. When you do so, ensure that content and controls remain clearly distinct.

Make essential information easy to find by giving it sufficient space. People want to view the most important information right away, so don’t obscure it by crowding it with nonessential details. You can make secondary information available in other parts of the window, or include it in an additional view.

Extend content to fill the screen or window. Make sure backgrounds and full-screen artwork extend to the edges of the display. Also ensure that scrollable layouts continue all the way to the bottom and the sides of the device screen. Controls and navigation components like sidebars and tab bars appear on top of content rather than on the same plane, so it’s important for your layout to take this into account.

When your content doesn’t span the full window, use a background extension view to provide the appearance of content behind the control layer on either side of the screen, such as beneath the sidebar or inspector. For developer guidance, see  and .


### Visual hierarchy

Differentiate controls from content. Take advantage of the Liquid Glass material to provide a distinct appearance for controls that’s consistent across iOS, iPadOS, and macOS. Instead of a background, use a scroll edge effect to provide a transition between content and the control area. For guidance, see .

Place items to convey their relative importance. People often start by viewing items in reading order — that is, from top to bottom and from the leading to trailing side — so it generally works well to place the most important items near the top and leading side of the window, display, or . Be aware that reading order varies by language, and take  languages into account as you design.

Align components with one another to make them easier to scan and to communicate organization and hierarchy. Alignment makes an app look neat and organized and can help people track content while scrolling or moving their eyes, making it easier to find information. Along with indentation, alignment can also help people understand an information hierarchy.

Take advantage of progressive disclosure to help people discover content that’s currently hidden. For example, if you can’t display all the items in a large collection at once, you need to indicate that there are additional items that aren’t currently visible. Depending on the platform, you might use a , or display parts of items to hint that people can reveal additional content by interacting with the view, such as by scrolling.

Make controls easier to use by providing enough space around them and grouping them in logical sections. If unrelated controls are too close together — or if other content crowds them — they can be difficult for people to tell apart or understand what they do, which can make your app or game hard to use. For guidance, see .


### Adaptability

Every app and game needs to adapt when the device or system context changes. In iOS, iPadOS, tvOS, and visionOS, the system defines a collection of traits that characterize variations in the device environment that can affect the way your app or game looks. Using SwiftUI or Auto Layout can help you ensure that your interface adapts dynamically to these traits and other context changes; if you don’t use these tools, you need to use alternative methods to do the work.

Here are some of the most common device and system variations you need to handle:

- Different device screen sizes, resolutions, and color spaces

- Different device orientations (portrait/landscape)

- System features like Dynamic Island and camera controls

- External display support, Display Zoom, and resizable windows on iPad

- Dynamic Type text-size changes

- Locale-based internationalization features like left-to-right/right-to-left layout direction, date/time/number formatting, font variation, and text length

Design a layout that adapts gracefully to context changes while remaining recognizably consistent. People expect your experience to work well and remain familiar when they rotate their device, resize a window, add another display, or switch to a different device. You can help ensure an adaptable interface by respecting system-defined safe areas, margins, and guides (where available) and specifying layout modifiers to fine-tune the placement of views in your interface.

Be prepared for text-size changes. People appreciate apps and games that respond when they choose a different text size. When you support  — a feature that lets people choose the size of visible text in iOS, iPadOS, tvOS, visionOS, and watchOS — your app or game can respond appropriately when people adjust text size. To support Dynamic Type in your Unity-based game, use Apple’s accessibility plug-in (for developer guidance, see ). For guidance on displaying text in your app, see .

Preview your app on multiple devices, using different orientations, localizations, and text sizes. You can streamline the testing process by first testing versions of your experience that use the largest and the smallest layouts. Although it’s generally best to preview features like wide-gamut color on actual devices, you can test on a simulated device in Device Hub to check for clipping and other layout issues. For example, if your iOS app or game supports landscape mode, you can use the simulator to make sure your layouts look great whether the device rotates left or right.

When necessary, scale artwork in response to display changes. For example, viewing your app or game in a different context — such as on a screen with a different aspect ratio — might make your artwork appear cropped, letterboxed, or pillarboxed. If this happens, don’t change the aspect ratio of the artwork; instead, scale it so that important visual content remains visible. In visionOS, the system automatically  a window when it moves along the z-axis.


### Guides and safe areas

A layout guide defines a rectangular region that helps you position, align, and space your content on the screen. The system includes predefined layout guides that make it easy to apply standard margins around content and restrict the width of text for optimal readability. You can also define custom layout guides. For developer guidance, see  and .

A safe area defines the area within a view that isn’t covered by a toolbar, tab bar, or other views a window might provide. Safe areas are essential for avoiding a device’s interactive and display features, like Dynamic Island on iPhone or the camera housing on some Mac models. For developer guidance, see  and .

Respect key display and system features in each platform. When an app or game doesn’t accommodate such features, it doesn’t feel at home in the platform and may be harder for people to use. In addition to helping you avoid display and system features, safe areas can also help you account for interactive components like bars, dynamically repositioning content when sizes change.

For templates that include the guides and safe areas for each platform, see .


### Platform considerations


#### iOS

Aim to support both portrait and landscape orientations. People appreciate apps and games that work well in different device orientations, but sometimes your experience needs to run in only portrait or only landscape. When this is the case, you can rely on people trying both orientations before settling on the one you support — there’s no need to tell people to rotate their device. If your app or game is landscape-only, make sure it runs equally well whether people rotate their device to the left or the right.

Prefer a full-bleed interface for your game. Give players a beautiful interface that fills the screen while accommodating the corner radius, sensor housing, and features like Dynamic Island. If necessary, consider giving players the option to view your game using a letterboxed or pillarboxed appearance.

Avoid full-width buttons. Buttons feel at home in iOS when they respect system-defined margins and are inset from the edges of the screen. If you need to include a full-width button, make sure it harmonizes with the curvature of the hardware and aligns with adjacent safe areas.

Hide the status bar only when it adds value or enhances your experience. The status bar displays information people find useful and it occupies an area of the screen most apps don’t fully use, so it’s generally a good idea to keep it visible. The exception is if you offer an in-depth experience like playing a game or viewing media, where it might make sense to hide the status bar.


#### iPadOS

People can freely resize windows down to a minimum width and height, similar to window behavior in macOS. It’s important to account for this resizing behavior and the full range of possible window sizes when designing your layout. For guidance, see  and .

As someone resizes a window, defer switching to a compact view for as long as possible. Design for a full-screen view first, and only switch to a compact view when a version of the full layout no longer fits. This helps the UI feel more stable and familiar in as many situations as possible. For more complex layouts such as , prefer hiding tertiary columns such as inspectors as the view narrows.

Test your layout at common system-provided sizes, and provide smooth transitions. Window controls provide the option to arrange windows to fill halves, thirds, and quadrants of the screen, so it’s important to check your layout at each of these sizes on a variety of devices. Be sure to minimize unexpected UI changes as people adjust down to the minimum and up to the maximum window size.

Consider a convertible tab bar for adaptive navigation. For many apps, you don’t need to choose between a tab bar or sidebar for navigation; instead, you can adopt a style of tab bar that provides both. The app first launches with your choice of a sidebar or a tab bar, and then people can tap to switch between them. As the view resizes, the presentation style changes to fit the width of the view. For guidance, see . For developer guidance, see .


#### macOS

Avoid placing controls or critical information at the bottom of a window. People often move windows so that the bottom edge is below the bottom of the screen.

Avoid displaying content within the camera housing at the top edge of the window. For developer guidance, see .


#### tvOS

Be prepared for a wide range of TV sizes. On Apple TV, layouts don’t automatically adapt to the size of the screen like they do on iPhone or iPad. Instead, apps and games show the same interface on every display. Take extra care in designing your layout so that it looks great in a variety of screen sizes.

Adhere to the screen’s safe area. Inset primary content 60 points from the top and bottom of the screen, and 80 points from the sides. It can be difficult for people to see content that close to the edges, and unintended cropping can occur due to overscanning on older TVs. Allow only partially displayed offscreen content and elements that deliberately flow offscreen to appear outside this zone.

Include appropriate padding between focusable elements. When you use UIKit and the focus APIs, an element gets bigger when it comes into focus. Consider how elements look when they’re focused, and make sure you don’t let them overlap important information. For developer guidance, see .


##### Grids

The following grid layouts provide an optimal viewing experience. Be sure to use appropriate spacing between unfocused rows and columns to prevent overlap when an item comes into focus.

If you use the UIKit collection view flow element, the number of columns in a grid is automatically determined based on the width and spacing of your content. For developer guidance, see .

Include additional vertical spacing for titled rows. If a row has a title, provide enough spacing between the bottom of the previous unfocused row and the center of the title to avoid crowding. Also provide spacing between the bottom of the title and the top of the unfocused items in the row.

Use consistent spacing. When content isn’t consistently spaced, it no longer looks like a grid and it’s harder for people to scan.

Make partially hidden content look symmetrical. To help direct attention to the fully visible content, keep partially hidden offscreen content the same width on each side of the screen.


#### visionOS

The guidance below can help you lay out content within the windows of your visionOS app or game, making it feel familiar and easy to use. For guidance on displaying windows in space and best practices for using depth, scale, and field of view in your visionOS app, see . To learn more about visionOS window components, see .

> [NOTE] When you add depth to content in a standard window, the content extends beyond the window’s bounds along the z-axis. If content extends too far along the z-axis, the system clips it.

Consider centering the most important content and controls in your app or game. Often, people can more easily discover and interact with content when it’s near the middle of a window, especially when the window is large.

Keep a window’s content within its bounds. In visionOS, the system displays window controls just outside a window’s bounds in the XY plane. For example, the Share menu appears above the window and the controls for resizing, moving, and closing the window appear below it. Letting 2D or 3D content encroach on these areas can make the system-provided controls, especially those below the window, difficult for people to use.

If you need to display additional controls that don’t belong within a window, use an ornament. An ornament lets you offer app controls that remain visually associated with a window without interfering with the system-provided controls. For example, a window’s toolbar and tab bar appear as ornaments. For guidance, see .

Make a window’s interactive components easy for people to look at. You need to include enough space around an interactive component so that visually identifying it is easy and comfortable, and to prevent the system-provided hover effect from obscuring other content. For example, place buttons so their centers are at least 60 points apart. For guidance, see , , and .


#### watchOS

Design your content to extend from one edge of the screen to the other. The Apple Watch bezel provides a natural visual padding around your content. To avoid wasting valuable space, consider minimizing the padding between elements.

Avoid placing more than two or three controls side by side in your interface. As a general rule, display no more than three buttons that contain glyphs — or two buttons that contain text — in a row. Although it’s usually better to let text buttons span the full width of the screen, two side-by-side buttons with short text labels can also work well, as long as the screen doesn’t scroll.

Support autorotation in views people might want to show others. When people flip their wrist away, apps typically respond to the motion by sleeping the display, but in some cases it makes sense to autorotate the content. For example, a wearer might want to show an image to a friend or display a QR code to a reader. For developer guidance, see .


### Specifications


#### iOS, iPadOS device screen dimensions

> [NOTE] All scale factors in the table above are UIKit scale factors, which may differ from native scale factors. For developer guidance, see  and .


#### iOS, iPadOS device size classes

A size class is a value that’s either regular or compact, where regular refers to a larger screen or a screen in landscape orientation and compact refers to a smaller screen or a screen in portrait orientation. For developer guidance, see .

Different size class combinations apply to the full-screen experience on different devices, based on screen size.


#### watchOS device screen dimensions


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos


### Change log

---

## Materials

`/design/human-interface-guidelines/materials`

_A material is a visual effect that creates a sense of depth, layering, and hierarchy between foreground and background elements._

Materials help visually separate foreground elements, such as text and controls, from background elements, such as content and solid colors. By allowing color to pass through from background to foreground, a material establishes visual hierarchy to help people more easily retain a sense of place.

Apple platforms feature two types of materials: Liquid Glass, and standard materials.  is a dynamic material that unifies the design language across Apple platforms, allowing you to present controls and navigation without obscuring underlying content. In contrast to Liquid Glass, the  help with visual differentiation within the content layer.


### Liquid Glass

Liquid Glass forms a distinct functional layer for controls and navigation elements — like tab bars and sidebars — that floats above the content layer, establishing a clear visual hierarchy between functional elements and content. Liquid Glass allows content to scroll and peek through from beneath these elements to give the interface a sense of dynamism and depth, all while maintaining legibility for controls and navigation.

Don’t use Liquid Glass in the content layer. Liquid Glass works best when it provides a clear distinction between interactive elements and content, and including it in the content layer can result in unnecessary complexity and a confusing visual hierarchy. Instead, use  for elements in the content layer, such as app backgrounds. An exception to this is for controls in the content layer with a transient interactive element like  and ; in these cases, the element takes on a Liquid Glass appearance to emphasize its interactivity when a person activates it.

Use Liquid Glass effects sparingly. Standard components from system frameworks pick up the appearance and behavior of this material automatically. If you apply Liquid Glass effects to a custom control, do so sparingly. Liquid Glass seeks to bring attention to the underlying content, and overusing this material in multiple custom controls can provide a subpar user experience by distracting from that content. Limit these effects to the most important functional elements in your app. For developer guidance, see .

Only use clear Liquid Glass for components that appear over visually rich backgrounds. Liquid Glass provides two variants —  and  — that you can choose when building custom components or styling some system components. The appearance of these variants can differ in response to certain system settings, like if people choose a preferred look for Liquid Glass in their device’s settings, or turn on accessibility settings that reduce transparency or increase contrast in the interface.

The regular variant blurs and adjusts the luminosity of background content to maintain legibility of text and other foreground elements. Scroll edge effects further enhance legibility by blurring and reducing the opacity of background content. Most system components use this variant. Use the regular variant when background content might create legibility issues, or when components have a significant amount of text, such as alerts, sidebars, or popovers.

The clear variant is highly translucent, which is ideal for prioritizing the visibility of the underlying content and ensuring visually rich background elements remain prominent. Use this variant for components that float above media backgrounds — such as photos and videos — to create a more immersive content experience.

For optimal contrast and legibility, determine whether to add a dimming layer behind components with clear Liquid Glass:

- If the underlying content is bright, consider adding a dark dimming layer of 35% opacity. For developer guidance, see .

- If the underlying content is sufficiently dark, or if you use standard media playback controls from AVKit that provide their own dimming layer, you don’t need to apply a dimming layer.

For guidance about the use of color, see .


### Standard materials

Use standard materials and effects — such as , , and  — to convey a sense of structure in the content beneath Liquid Glass.

Choose materials and effects based on semantic meaning and recommended usage. Avoid selecting a material or effect based on the apparent color it imparts to your interface, because system settings can change its appearance and behavior. Instead, match the material or vibrancy style to your specific use case.

Help ensure legibility by using vibrant colors on top of materials. When you use system-defined vibrant colors, you don’t need to worry about colors seeming too dark, bright, saturated, or low contrast in different contexts. Regardless of the material you choose, use vibrant colors on top of it. For guidance, see .

Consider contrast and visual separation when choosing a material to combine with blur and vibrancy effects. For example, consider that:

- Thicker materials, which are more opaque, can provide better contrast for text and other elements with fine features.

- Thinner materials, which are more translucent, can help people retain their context by providing a visible reminder of the content that’s in the background.

For developer guidance, see .


### Platform considerations


#### iOS, iPadOS

In addition to Liquid Glass, iOS and iPadOS continue to provide four standard materials — ultra-thin, thin, regular (default), and thick — which you can use in the content layer to help create visual distinction.

iOS and iPadOS also define vibrant colors for labels, fills, and separators that are specifically designed to work with each material. Labels and fills both have several levels of vibrancy; separators have one level. The name of a level indicates the relative amount of contrast between an element and the background: The default level has the highest contrast, whereas quaternary (when it exists) has the lowest contrast.

Except for quaternary, you can use the following vibrancy values for labels on any material. In general, avoid using quaternary on top of the  and  materials, because the contrast is too low.

-  (default)

You can use the following vibrancy values for fills on all materials.

-  (default)

The system provides a single, default vibrancy value for a , which works well on all materials.


#### macOS

macOS provides several standard materials with designated purposes, and vibrant versions of all . For developer guidance, see .

Choose when to allow vibrancy in custom views and controls. Depending on configuration and system settings, system views and controls use vibrancy to make foreground content stand out against any background. Test your interface in a variety of contexts to discover when vibrancy enhances the appearance and improves communication.

Choose a background blending mode that complements your interface design. macOS defines two modes that blend background content: behind window and within window. For developer guidance, see .


#### tvOS

In tvOS, Liquid Glass appears throughout navigation elements and system experiences such as Top Shelf and Control Center. Certain interface elements, like image views and buttons, adopt Liquid Glass when they gain focus.

In addition to Liquid Glass, tvOS continues to provide standard materials, which you can use to help define structure in the content layer. The thickness of a standard material affects how prominently the underlying content shows through. For example, consider using standard materials in the following ways:


#### visionOS

In visionOS, windows generally use an unmodifiable system-defined material called glass that helps people stay grounded by letting light, the current Environment, virtual content, and objects in people’s surroundings show through. Glass is an adaptive material that limits the range of background color information so a window can continue to provide contrast for app content while becoming brighter or darker depending on people’s physical surroundings and other virtual content.

> [NOTE] visionOS doesn’t have a distinct Dark Mode setting. Instead, glass automatically adapts to the luminance of the objects and colors behind it.

Prefer translucency to opaque colors in windows. Areas of opacity can block people’s view, making them feel constricted and reducing their awareness of the virtual and physical objects around them.

If necessary, choose materials that help you create visual separations or indicate interactivity in your app. If you need to create a custom component, you may need to specify a system material for it. Use the following examples for guidance.

- The  material brings attention to interactive elements like buttons and selected items.

- The  material can help you visually separate sections of your app, like a sidebar or a grouped table view.

- The  material lets you create a dark element that remains visually distinct when it’s on top of an area that uses a `regular` background.

To ensure foreground content remains legible when it displays on top of a material, visionOS applies vibrancy to text, symbols, and fills. Vibrancy enhances the sense of depth by pulling light and color forward from both virtual and physical surroundings.

visionOS defines three vibrancy values that help you communicate a hierarchy of text, symbols, and fills.

- Use  for standard text.

- Use  for descriptive text like footnotes and subtitles.

- Use  for inactive elements, and only when text doesn’t need high legibility.


#### watchOS

Use materials to provide context in a full-screen modal view. Because full-screen modal views are common in watchOS, the contrast provided by material layers can help orient people in your app and distinguish controls and system elements from other content. Avoid removing or replacing material backgrounds for modal sheets when they’re provided by default.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Motion

`/design/human-interface-guidelines/motion`

_Beautiful, fluid motions bring the interface to life, conveying status, providing feedback and instruction, and enriching the visual experience of your app or game._

Many system components automatically include motion, letting you offer familiar and consistent experiences throughout your app or game. System components might also adjust their motion in response to factors like accessibility settings or different input methods. For example, the movement of  responds to direct touch interaction with greater emphasis to reinforce the feeling of a tactile experience, but produces a more subdued effect when a person interacts using a trackpad.

If you design custom motion, follow the guidelines below.


### Best practices

Add motion purposefully, supporting the experience without overshadowing it. Don’t add motion for the sake of adding motion. Gratuitous or excessive animation can distract people and may make them feel disconnected or physically uncomfortable.

Make motion optional. Not everyone can or wants to experience the motion in your app or game, so it’s essential to avoid using it as the only way to communicate important information. To help everyone enjoy your app or game, supplement visual feedback by also using alternatives like  and  to communicate.


### Providing feedback

Strive for realistic feedback motion that follows people’s gestures and expectations. In nongame apps, accurate, realistic motion can help people understand how something works, but feedback motion that doesn’t make sense can make them feel disoriented. For example, if someone reveals a view by sliding it down from the top, they don’t expect to dismiss the view by sliding it to the side.

Aim for brevity and precision in feedback animations. When animated feedback is brief and precise, it tends to feel lightweight and unobtrusive, and it can often convey information more effectively than prominent animation. For example, when a game displays a succinct animation that’s precisely tied to a successful action, players can instantly get the message without being distracted from their gameplay. Another example is in visionOS: When people tap a panorama in Photos, it quickly and smoothly expands to fill the space in front of them, helping them track the transition without making them wait to enjoy the content.

In apps, generally avoid adding motion to UI interactions that occur frequently. The system already provides subtle animations for interactions with standard interface elements. For a custom element, you generally want to avoid making people spend extra time paying attention to unnecessary motion every time they interact with it.

Let people cancel motion. As much as possible, don’t make people wait for an animation to complete before they can do anything, especially if they have to experience the animation more than once.

Consider using animated symbols where it makes sense. When you use SF Symbols 5 or later, you can apply animations to SF Symbols or custom symbols. For guidance, see .


### Leveraging platform capabilities

Make sure your game’s motion looks great by default on each platform you support. In most games, maintaining a consistent frame rate of 30 to 60 fps typically results in a smooth, visually appealing experience. For each platform you support, use the device’s graphics capabilities to enable default settings that let people enjoy your game without first having to change those settings.

Let people customize the visual experience of your game to optimize performance or battery life. For example, consider letting people switch between power modes when the system detects the presence of an external power source.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, or tvOS.


#### visionOS

In addition to subtly communicating context, drawing attention to information, and enriching immersive experiences, motion in visionOS can combine with  to provide essential feedback when people look at interactive elements. Because motion is likely to be a large part of your visionOS experience, it’s crucial to avoid causing distraction, confusion, or discomfort.

As much as possible, avoid displaying motion at the edges of a person’s field of view. People can be particularly sensitive to motion that occurs in their peripheral vision: in addition to being distracting, such motion can even cause discomfort because it can make people feel like they or their surroundings are moving. If you need to show an object moving in the periphery during an immersive experience, make sure the object’s brightness level is similar to the rest of the visible content.

Help people remain comfortable when showing the movement of large virtual objects. If an object is large enough to fill a lot of the , occluding most or all of , people can naturally perceive it as being part of their surroundings. To help people perceive the object’s movement without making them think that they or their surroundings are moving, you can increase the object’s translucency, helping people see through it, or lower its contrast to make its motion less noticeable.

> [NOTE] People can experience discomfort even when they’re the ones moving a large virtual object, such as a window. Although adjusting translucency and contrast can help in this scenario, consider also keeping a window’s size fairly small.

Consider using fades when you need to relocate an object. When an object moves from one location to another, people naturally watch the movement. If such movement doesn’t communicate anything useful to people, you can fade the object out before moving it and fade it back in after it’s in the new location.

In general, avoid letting people rotate a virtual world. When a virtual world rotates, the experience typically upsets people’s sense of stability, even when they control the rotation and the movement is subtle. Instead, consider using instantaneous directional changes during a quick fade-out.

Consider giving people a stationary frame of reference. It can be easier for people to handle visual movement when it’s contained within an area that doesn’t move. In contrast, if the entire surrounding area appears to move — for example, in a game that automatically moves a player through space — people can feel unwell.

Avoid showing objects that oscillate in a sustained way. In particular, you want to avoid showing an oscillation that has a frequency of around 0.2 Hz because people can be very sensitive to this frequency. If you need to show objects oscillating, aim to keep the amplitude low and consider making the content translucent.


#### watchOS

SwiftUI provides a powerful and streamlined way to add motion to your app. If you need to use WatchKit to animate layout and appearance changes — or create animated image sequences — see .

> [NOTE] All layout- and appearance-based animations automatically include built-in easing that plays at the start and end of the animation. You can’t turn off or customize easing.


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos


### Change log

---

## Privacy

`/design/human-interface-guidelines/privacy`

_Privacy is paramount: it’s critical to be transparent about the privacy-related data and resources you require and essential to protect the data people allow you to access._

People use their devices in very personal ways and they expect apps to help them preserve their privacy.

When you submit a new or updated app, you must provide details about your privacy practices and the privacy-relevant data you collect so the App Store can display the information on your product page. (You can manage this information at any time in .) People use the privacy details on your product page to make an informed decision before they download your app. To learn more, see .


### Best practices

Request access only to data that you actually need. Asking for more data than a feature needs — or asking for data before a person shows interest in the feature — can make it hard for people to trust your app. Give people precise control over their data by making your permission requests as specific as possible.

Be transparent about how your app collects and uses people’s data. People are less likely to be comfortable sharing data with your app if they don’t understand exactly how you plan to use it. Always respect people’s choices to use system features like Hide My Email and Mail Privacy Protection, and be sure you understand your obligations with regard to app tracking. To learn more about Apple privacy features, see ; for developer guidance, see .

Process data on the device where possible. In iOS, for example, you can take advantage of the Apple Neural Engine and custom CreateML models to process the data right on the device, helping you avoid lengthy and potentially risky round trips to a remote server.

Adopt system-defined privacy protections and follow security best practices. For example, in iOS 15 and later, you can rely on CloudKit to provide encryption and key management for additional data types, like strings, numbers, and dates.


### Requesting permission

Here are several examples of the things you must request permission to access:

- Personal data, including location, health, financial, contact, and other personally identifying information

- User-generated content like emails, messages, calendar data, contacts, gameplay information, Apple Music activity, HomeKit data, and audio, video, and photo content

- Protected resources like Bluetooth peripherals, home automation features, Wi-Fi connections, and local networks

- Device capabilities like camera and microphone

- In a visionOS app running in a Full Space, ARKit data, such as hand tracking, plane estimation, image anchoring, and world tracking

- The device’s advertising identifier, which supports app tracking

The system provides a standard alert that lets people view each request you make. You supply copy that describes why your app needs access, and the system displays your description in the alert. People can also view the description — and update their choice — in Settings > Privacy.

Request permission only when your app clearly needs access to the data or resource. It’s natural for people to be suspicious of a request for personal information or access to a device capability, especially if there’s no obvious need for it. Ideally, wait to request permission until people actually use an app feature that requires access. For example, you can use the  to give people a way to share their location after they indicate interest in a feature that needs that information.

Avoid requesting permission at launch unless the data or resource is required for your app to function. People are less likely to be bothered by a launch-time request when it’s obvious why you’re making it. For example, people understand that a navigation app needs access to their location before they can benefit from it. Similarly, before people can play a visionOS game that lets them bounce virtual objects off walls in their surroundings, they need to permit the game to access information about their surroundings.

Write copy that clearly describes how your app uses the ability, data, or resource you’re requesting. The standard alert displays your copy (called a purpose string or usage description string) after your app name and before the buttons people use to grant or deny their permission. Aim for a brief, complete sentence that’s straightforward, specific, and easy to understand. Use sentence case, avoid passive voice, and include a period at the end. For developer guidance, see  and .

Here are several examples of the standard system alert:


#### Pre-alert screens, windows, or views

Ideally, the current context helps people understand why you’re requesting their permission. If it’s essential to provide additional details, you can display a custom screen or window before the system alert appears. The following guidelines apply to custom views that display before system alerts that request permission to access protected data and resources, including camera, microphone, location, contact, calendar, and tracking.

Include only one button and make it clear that it opens the system alert. People can feel manipulated when a custom screen or window also includes a button that doesn’t open the alert because the experience diverts them from making their choice. Another type of manipulation is using a term like “Allow” to title the custom screen’s button. If the custom button seems similar in meaning and visual weight to the allow button in the alert, people can be more likely to choose the alert’s allow button without meaning to. Use a term like “Continue” or “Next” to title the single button in your custom screen or window, clarifying that its action is to open the system alert.

Don’t include additional actions in your custom screen or window. For example, don’t provide a way for people to leave the screen or window without viewing the system alert — like offering an option to close or cancel.


#### Tracking requests

App tracking is a sensitive issue. In some cases, it might make sense to display a custom screen or window that describes the benefits of tracking. If you want to perform app tracking as soon as people launch your app, you must display the system-provided alert before you collect any tracking data.

Never precede the system-provided alert with a custom screen or window that could confuse or mislead people. People sometimes tap quickly to dismiss alerts without reading them. A custom messaging screen, window, or view that takes advantage of such behaviors to influence choices will lead to rejection by App Store review.

There are several prohibited custom-screen designs that will cause rejection. Some examples are offering incentives, displaying a screen or window that looks like a request, displaying an image of the alert, and annotating the screen behind the alert (as shown below). To learn more, see .


### Location button

In iOS, iPadOS, and watchOS, Core Location provides a button so people can grant your app temporary authorization to access their location at the moment a task needs it. A location button’s appearance can vary to match your app’s UI and it always communicates the action of location sharing in a way that’s instantly recognizable.

The first time people open your app and tap a location button, the system displays a standard alert. The alert helps people understand how using the button limits your app’s access to their location, and reminds them of the location indicator that appears when sharing starts.

After people confirm their understanding of the button’s action, simply tapping the location button gives your app one-time permission to access their location. Although each one-time authorization expires when people stop using your app, they don’t need to reconfirm their understanding of the button’s behavior.

> [NOTE] If your app has no authorization status, tapping the location button has the same effect as when a person chooses Allow Once in the standard alert. If people previously chose While Using the App, tapping the location button doesn’t change your app’s status. For developer guidance, see  (SwiftUI) and  (Swift).

Consider using the location button to give people a lightweight way to share their location for specific app features. For example, your app might help people attach their location to a message or post, find a store, or identify a building, plant, or animal they’ve encountered in their location. If you know that people often grant your app Allow Once permission, consider using the location button to help them benefit from sharing their location without having to repeatedly interact with the alert.

Consider customizing the location button to harmonize with your UI. Specifically, you can:

- Choose the system-provided title that works best with your feature, such as “Current Location” or “Share My Current Location.”

- Choose the filled or outlined location glyph.

- Select a background color and a color for the title and glyph.

- Adjust the button’s corner radius.

To help people recognize and trust location buttons, you can’t customize the button’s other visual attributes. The system also ensures a location button remains legible by warning you about problems like low-contrast color combinations or too much translucency. In addition to fixing such problems, you’re responsible for making sure the text fits in the button — for example, button text needs to fit without truncation at all accessibility text sizes and when translated into other languages.

> [IMPORTANT] If the system identifies consistent problems with your customized location button, it won’t give your app access to the device location when people tap it. Although such a button can perform other app-specific actions, people may lose trust in your app if your location button doesn’t work as they expect.


### Protecting data

Protecting people’s information is paramount. Give people confidence in your app’s security and help preserve their privacy by taking advantage of system-provided security technologies when you need to store information locally, authorize people for specific operations, and transport information across a network.

Here are some high-level guidelines.

Avoid relying solely on passwords for authentication. Where possible, use  to replace passwords. If you need to continue using passwords for authentication, augment security by requiring two-factor authentication (for developer guidance, see ). To further protect access to apps that people keep logged in on their device, use biometric identification like Face ID, Optic ID, or Touch ID. For developer guidance, see .

Store sensitive information in a keychain. A keychain provides a secure, predictable user experience when handling someone’s private information. For developer guidance, see .

Never store passwords or other secure content in plain-text files. Even if you restrict access using file permissions, sensitive information is much safer in an encrypted keychain.

Avoid inventing custom authentication schemes. If your app requires authentication, prefer system-provided features like ,  or . For related guidance, see .


### Platform considerations

No additional considerations for iOS, iPadOS, tvOS, or watchOS.


#### macOS

Sign your app with a valid Developer ID. If you choose to distribute your app outside the store, signing your app with Developer ID identifies you as an Apple developer and confirms that your app is safe to use. For developer guidance, see .

Protect people’s data with app sandboxing. Sandboxing provides your app with access to system resources and user data while protecting it from malware. All apps submitted to the Mac App Store require sandboxing. For developer guidance, see .

Avoid making assumptions about who is signed in. Because of fast user switching, multiple people may be active on the same system.


#### visionOS

By default, visionOS uses ARKit algorithms to handle features like persistence, world mapping, segmentation, matting, and environment lighting. These algorithms are always running, allowing apps and games to automatically benefit from ARKit while in the Shared Space.

ARKit doesn’t send data to apps in the Shared Space; to access ARKit APIs, your app must open a Full Space. Additionally, features like Plane Estimation, Scene Reconstruction, Image Anchoring, and Hand Tracking require people’s permission to access any information. For developer guidance, see .

In visionOS, user input is private by design. The system automatically displays hover effects when people look at interactive components you create using SwiftUI or RealityKit, giving people the visual feedback they need without exposing where they’re looking before they tap. For guidance, see  and .

Developer access to device cameras works differently in visionOS than it does in other platforms. Specifically, the back camera provides blank input and is only available as a compatibility convenience; the front camera provides input for , but only after people grant their permission. If the iOS or iPadOS app you’re bringing to visionOS includes a feature that needs camera access, remove it or replace it with an option for people to import content instead. For developer guidance, see .


### Resources


##### Related


##### Developer documentation

 — UIKit

 — CoreLocation


##### Videos


### Change log

---

## Right to left

`/design/human-interface-guidelines/right-to-left`

_Support right-to-left languages like Arabic and Hebrew by reversing your interface as needed to match the reading direction of the related scripts._

When people choose a language for their device — or just your app or game — they expect the interface to adapt in various ways (to learn more, see ).

System-provided UI frameworks support right-to-left (RTL) by default, allowing system-provided UI components to flip automatically in the RTL context. If you use system-provided elements and standard layouts, you might not need to make any changes to your app’s automatically reversed interface.

If you want to fine-tune your layout or enhance specific localizations to adapt to different currencies, numerals, or mathematical symbols that can occur in various locales in countries that use RTL languages, follow these guidelines.


### Text alignment

Adjust text alignment to match the interface direction, if the system doesn’t do so automatically. For example, if you left-align text with content in the left-to-right (LTR) context, right-align the text to match the content’s mirrored position in the RTL context.

Align a paragraph based on its language, not on the current context. When the alignment of a paragraph — defined as three or more lines of text — doesn’t match its language, it can be difficult to read. For example, right-aligning a paragraph that consists of LTR text can make the beginning of each line difficult to see. To improve readability, continue aligning one- and two-line text blocks to match the reading direction of the current context, but align a paragraph to match its language.

Use a consistent alignment for all text items in a list. To ensure a comfortable reading and scanning experience, reverse the alignment of all items in a list, including items that are displayed in a different script.


### Numbers and characters

Different RTL languages can use different number systems. For example, Hebrew text uses Western Arabic numerals, whereas Arabic text might use either Western or Eastern Arabic numerals. The use of Western and Eastern Arabic numerals varies among countries and regions and even among areas within the same country or region.

If your app covers mathematical concepts or other number-centric topics, it’s a good idea to identify the appropriate way to display such information in each locale you support. In contrast, apps that don’t address number-related topics can generally rely on system-provided number representations.

Don’t reverse the order of numerals in a specific number. Regardless of the current language or the surrounding content, the digits in a specific number — such as “541,” a phone number, or a credit card number — always appear in the same order.

Reverse the order of numerals that show progress or a counting direction; never flip the numerals themselves. Controls like progress bars, sliders, and rating controls often include numerals to clarify their meaning. If you use numerals in this way, be sure to reverse the order of the numerals to match the direction of the flipped control. Also reverse a sequence of numerals if you use the sequence to communicate a specific order.


### Controls

Flip controls that show progress from one value to another. Because people tend to view forward progress as moving in the same direction as the language they read, it makes sense to flip controls like sliders and progress indicators in the RTL context. When you do this, also be sure to reverse the positions of the accompanying glyphs or images that depict the beginning and ending values of the control.

Flip controls that help people navigate or access items in a fixed order. For example, in the RTL context, a back button must point to the right so the flow of screens matches the reading order of the RTL language. Similarly, next or previous buttons that let people access items in an ordered list need to flip in the RTL context to match the reading order.

Preserve the direction of a control that refers to an actual direction or points to an onscreen area. For example, if you provide a control that means “to the right,” it must always point right, regardless of the current context.

Visually balance adjacent Latin and RTL scripts when necessary. In buttons, labels, and titles, Arabic or Hebrew text can appear too small when next to uppercased Latin text, because Arabic and Hebrew don’t include uppercase letters. To visually balance Arabic or Hebrew text with Latin text that uses all capitals, it often works well to increase the RTL font size by about 2 points.


### Images

Avoid flipping images like photographs, illustrations, and general artwork. Flipping an image often changes the image’s meaning; flipping a copyrighted image could be a violation. If an image’s content is strongly connected to reading direction, consider creating a new version of the image instead of flipping the original.

Reverse the positions of images when their order is meaningful. For example, if you display multiple images in a specific order like chronological, alphabetical, or favorite, reverse their positions to preserve the order’s meaning in the RTL context.


### Interface icons

When you use  to supply interface icons for your app, you get variants for the RTL context and localized symbols for Arabic and Hebrew, among other languages. If you create custom symbols, you can specify their directionality. For developer guidance, see .

Flip interface icons that represent text or reading direction. For example, if an interface icon uses left-aligned bars to represent text in the LTR context, right-align the bars in the RTL context.

Consider creating a localized version of an interface icon that displays text. Some interface icons include letters or words to help communicate a script-related concept, like font-size choice or a signature. If you have a custom interface icon that needs to display actual text, consider creating a localized version. For example, SF Symbols offers different versions of the signature, rich-text, and I-beam pointer symbols for use with Latin, Hebrew, and Arabic text, among others.

If you have a custom interface icon that uses letters or words to communicate a concept unrelated to reading or writing, consider designing an alternative image that doesn’t use text.

Flip an interface icon that shows forward or backward motion. When something moves in the same direction that people read, they typically interpret that direction as forward; when something moves in the opposite direction, people tend to interpret the direction as backward. An interface icon that depicts an object moving forward or backward needs to flip in the RTL context to preserve the meaning of the motion. For example, an icon that represents a speaker typically shows sound waves emanating forward from the speaker. In the LTR context, the sound waves come from the left, so in the RTL context, the icon needs to flip to show the waves coming from the right.

Don’t flip logos or universal signs and marks. Displaying a flipped logo confuses people and can have legal repercussions. Always display a logo in its original form, even if it includes text. People expect universal symbols and marks like the checkmark to have a consistent appearance, so avoid flipping them.

In general, avoid flipping interface icons that depict real-world objects. Unless you use the object to indicate directionality, it’s best to avoid flipping an icon that represents a familiar item. For example, clocks work the same everywhere, so a traditional clock interface icon needs to look the same regardless of language direction. Some interface icons might seem to reference language or reading direction because they represent items that are slanted for right-handed use. However, most people are right-handed, so flipping an icon that shows a right-handed tool isn’t necessary and might be confusing.

Before merely flipping a complex custom interface icon, consider its individual components and the overall visual balance. In some cases, a component — like a badge, slash, or magnifying glass — needs to adhere to a visual design language regardless of localization. For example, SF Symbols maintains visual consistency by using the same backslash to represent the prohibition or negation of a symbol’s meaning in both LTR and RTL versions.

In other cases, you might need to flip a component (or its position) to ensure the localized version of the icon still makes sense. For example, if a badge represents the actual UI that people see in your app, it needs to flip if your UI flips. Alternatively, if a badge modifies the meaning of an interface icon, consider whether flipping the badge preserves both the modified meaning and the overall visual balance of the icon. In the images shown below, the badge doesn’t depict an object in the UI, but keeping it in the top-right corner visually unbalances the cart.

If your custom interface icon includes a component that can imply handedness, like a tool, consider preserving the orientation of the tool while flipping the base image if necessary.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos

---

## SF Symbols

`/design/human-interface-guidelines/sf-symbols`

_SF Symbols provides thousands of consistent, highly configurable symbols that integrate seamlessly with the San Francisco system font, automatically aligning with text in all weights and sizes._

You can use a symbol to convey an object or concept wherever interface icons can appear, such as in toolbars, tab bars, context menus, and within text.

Availability of individual symbols and features varies based on the version of the system you’re targeting. Symbols and symbol features introduced in a given year aren’t available in earlier operating systems.

Visit  to download the app and browse the full set of symbols. Be sure to understand the terms and conditions for using SF Symbols, including the prohibition against using symbols — or images that are confusingly similar — in app icons, logos, or any other trademarked use. For developer guidance, see .


### Rendering modes

SF Symbols provides four rendering modes — monochrome, hierarchical, palette, and multicolor — that give you multiple options when applying color to symbols. For example, you might want to use multiple opacities of your app’s accent color to give symbols depth and emphasis, or specify a palette of contrasting colors to display symbols that coordinate with various color schemes.

To support the rendering modes, SF Symbols organizes a symbol’s paths into distinct layers. For example, the `cloud.sun.rain.fill` symbol consists of three layers: the primary layer contains the cloud paths, the secondary layer contains the paths that define the sun and its rays, and the tertiary layer contains the raindrop paths.

Depending on the rendering mode you choose, a symbol can produce various appearances. For example, Hierarchical rendering mode assigns a different opacity of a single color to each layer, creating a visual hierarchy that gives depth to the symbol.

To learn more about supporting rendering modes in custom symbols, see .

SF Symbols supports the following rendering modes.

Monochrome — Applies one color to all layers in a symbol. Within a symbol, paths render in the color you specify or as a transparent shape within a color-filled path.

Hierarchical — Applies one color to all layers in a symbol, varying the color’s opacity according to each layer’s hierarchical level.

Palette — Applies two or more colors to a symbol, using one color per layer. Specifying only two colors for a symbol that defines three levels of hierarchy means the secondary and tertiary layers use the same color.

Multicolor — Applies intrinsic colors to some symbols to enhance meaning. For example, the `leaf` symbol uses green to reflect the appearance of leaves in the physical world, whereas the `trash.slash` symbol uses red to signal data loss. Some multicolor symbols include layers that can receive other colors.

Regardless of rendering mode, using system-provided colors ensures that symbols automatically adapt to accessibility accommodations and appearance modes like vibrancy and Dark Mode. For developer guidance, see .

Confirm that a symbol’s rendering mode works well in every context. Depending on factors like the size of a symbol and its contrast with the current background color, different rendering modes can affect how well people can discern the symbol’s details. You can use the automatic setting to get a symbol’s preferred rendering mode, but it’s still a good idea to check the results for places where a different rendering mode might improve a symbol’s legibility.


### Gradients

In SF Symbols 7 and later, gradient rendering generates a smooth linear gradient from a single source color. You can use gradients across all rendering modes for both system and custom colors and for custom symbols. Gradients render for symbols of any size, but look best at larger sizes.


### Variable color

With variable color, you can represent a characteristic that can change over time — like capacity or strength — regardless of rendering mode. To visually communicate such a change, variable color applies color to different layers of a symbol as a value reaches different thresholds between zero and 100 percent.

For example, you could use variable color with the `speaker.wave.3` symbol to communicate three different ranges of sound — plus the state where there’s no sound — by mapping the layers that represent the curved wave paths to different ranges of decibel values. In the case of no sound, no wave layers get color. In all other cases, a wave layer receives color when the sound reaches a threshold the system defines based on the  number of nonzero states you want to represent.

Sometimes, it can make sense for some of a symbol’s layers to opt out of variable color. For example, in the `speaker.wave.3` symbol shown above, the layer that contains the speaker path doesn’t receive variable color because a speaker doesn’t change as the sound level changes. A symbol can support variable color in any number of layers.

Use variable color to communicate change — don’t use it to communicate depth. To convey depth and visual hierarchy, use Hierarchical rendering mode to elevate certain layers and distinguish foreground and background elements in a symbol.


### Weights and scales

SF Symbols provides symbols in a wide range of weights and scales to help you create adaptable designs.

Each of the nine symbol weights — from ultralight to black — corresponds to a weight of the San Francisco system font, helping you achieve precise weight matching between symbols and adjacent text, while supporting flexibility for different sizes and contexts.

Each symbol is also available in three scales: small, medium (the default), and large. The scales are defined relative to the cap height of the San Francisco system font.

Specifying a scale lets you adjust a symbol’s emphasis compared to adjacent text, without disrupting the weight matching with text that uses the same point size. For developer guidance, see  (SwiftUI),  (UIKit), and  (AppKit).


### Design variants

SF Symbols defines several design variants — such as fill, slash, and enclosed — that can help you communicate precise states and actions while maintaining visual consistency and simplicity in your UI. For example, you could use the slash variant of a symbol to show that an item or action is unavailable, or use the fill variant to indicate selection.

Outline is the most common variant in SF Symbols. An outlined symbol has no solid areas, resembling the appearance of text. Most symbols are also available in a fill variant, in which the areas within some shapes are solid.

In addition to outline and fill, SF Symbols also defines variants that include a slash or enclose a symbol within a shape like a circle, square, or rectangle. In many cases, enclosed and slash variants can combine with outline or fill variants.

SF Symbols provides many variants for specific languages and writing systems, including Latin, Arabic, Hebrew, Hindi, Thai, Chinese, Japanese, Korean, Cyrillic, Devanagari, and several Indic numeral systems. Language- and script-specific variants adapt automatically when the device language changes. For guidance, see .

Symbol variants support a range of design goals. For example:

- The outline variant works well in toolbars, lists, and other places where you display a symbol alongside text.

- Symbols that use an enclosing shape — like a square or circle — can improve legibility at small sizes.

- The solid areas in a fill variant tend to give a symbol more visual emphasis, making it a good choice for iOS tab bars and swipe actions and places where you use an accent color to communicate selection.

In many cases, the view that displays a symbol determines whether to use outline or fill, so you don’t have to specify a variant. For example, an iOS tab bar prefers the fill variant, whereas a toolbar takes the outline variant.


### Animations

SF Symbols provides a collection of expressive, configurable animations that enhance your interface and add vitality to your app. Symbol animations help communicate ideas, provide feedback in response to people’s actions, and signal changes in status or ongoing activities.

Animations work on all SF Symbols in the library, in all rendering modes, weights, and scales, and on custom symbols. For considerations when animating custom symbols, see . You can control the playback of an animation, whether you want the animation to run from start to finish, or run indefinitely, repeating its effect until a condition is met. You can customize behaviors, like changing the playback speed of an animation or determining whether to reverse an animation before repeating it. For developer guidance, see  and .

Appear — Causes a symbol to gradually emerge into view.

Disappear — Causes a symbol to gradually recede out of view.

Bounce — Briefly scales a symbol with an elastic-like movement that goes either up or down and then returns to the symbol’s initial state. The bounce animation plays once by default and can help communicate that an action occurred or needs to take place.

Scale — Changes the size of a symbol, increasing or decreasing its scale. Unlike the bounce animation, which returns the symbol to its original state, the scale animation persists until you set a new scale or remove the effect. You might use the scale animation to draw people’s attention to a selected item or as feedback when people choose a symbol.

Pulse — Varies the opacity of a symbol over time. This animation automatically pulses only the layers within a symbol that are annotated to pulse, and optionally can pulse all layers within a symbol. You might use the pulse animation to communicate ongoing activity, playing it continuously until a condition is met.

Variable color — Incrementally varies the opacity of layers within a symbol. This animation can be cumulative or iterative. When cumulative, color changes persist for each layer until the animation cycle is complete. When iterative, color changes occur one layer at a time. You might use variable color to communicate progress or ongoing activity, such as playback, connecting, or broadcasting. You can customize the animation to autoreverse — meaning reverse the animation to the starting point and replay the sequence — as well as hide inactive layers rather than reduce their opacity.

The arrangement of layers within a symbol determines how variable color behaves during a repeating animation. Symbols with layers that are arranged linearly where the start and end points don’t meet are annotated as open loop. Symbols with layers that follow a complete shape where the start and end points do meet, like in a circular progress indicator, are annotated as closed loop. Variable color animations for symbols with closed loop designs feature seamless, continuous playback.

Replace — Replaces one symbol with another. The replace animation works between arbitrary symbols and across all weights and rendering modes. This animation features three configurations:

- Down-up, where the outgoing symbol scales down and the incoming symbol scales up, communicating a change in state.

- Up-up, where both the outgoing and incoming symbols scale up. This configuration communicates a change in state that includes a sense of forward progression.

- Off-up, where the outgoing symbol hides immediately and the incoming symbol scales up. This configuration communicates a state change that emphasizes the next available state or action.

Magic Replace — Performs a smart transition between two symbols with related shapes. For example, slashes can draw on and off, and badges can appear or disappear, or you can replace them independently of the base symbol. Magic Replace is the new default replace animation, but doesn’t occur between unrelated symbols; the default down-up animation occurs instead. You can choose a custom direction for the fallback animation in these situations if you prefer one other than the default.

Wiggle — Moves the symbol back and forth along a directional axis. You might use the wiggle animation to highlight a change or a call to action that a person might overlook. Wiggle can also add a dynamic emphasis to an interaction or reinforce what the symbol is representing, such as when an arrow points in a specific direction.

Breathe — Smoothly increases and decreases the presence of a symbol, giving it a living quality. You might use the breathe animation to convey status changes, or signal that an activity is taking place, like an ongoing recording session. Breathe is similar to pulse; however pulse animates by changing opacity alone, while breathe changes both opacity and size to convey ongoing activity.

Rotate — Rotates the symbol to act as a visual indicator or imitate an object’s behavior in the real world. For example, when a task is in progress, rotation confirms that it’s working as expected. The rotate animation causes some symbols to rotate entirely, while in others only certain parts of the symbol rotate. Symbols like the desk fan, for example, use the By Layer rotation option to spin only the fan blades.

Draw On / Draw Off — In SF Symbols 7 and later, draws the symbol along a path through a set of guide points, either from offscreen to onscreen (Draw On) or from onscreen to offscreen (Draw Off). You can draw all layers at once, stagger them, or draw each layer one at a time. You might use the draw animation to convey progress, as with a download, or to reinforce the meaning of a symbol, like a directional arrow.

Apply symbol animations judiciously. While there’s no limit to how many animations you can add to a view, too many animations can overwhelm an interface and distract people.

Make sure that animations serve a clear purpose in communicating a symbol’s intent. Each type of animation has a discrete movement that communicates a certain type of action or elicits a certain response. Consider how people might interpret an animated symbol and whether the animation, or combination of animations, might be confusing.

Use symbol animations to communicate information more efficiently. Animations provide visual feedback, reinforcing that something happened in your interface. You can use animations to present complex information in a simple way and without taking up a lot of visual space.

Consider your app’s tone when adding animations. When animating a symbol, think about what the animation can convey and how that might align with your brand identity and your app’s overall style and tone. For guidance, see .


### Custom symbols

If you need a symbol that SF Symbols doesn’t provide, you can create your own. To create a custom symbol, first export the template for a symbol that’s similar to the design you want, then use a vector-editing tool to modify it. For developer guidance, see .

> [IMPORTANT] SF Symbols includes copyrighted symbols that depict Apple products and features. You can display these symbols in your app, but you can’t customize them. To help you identify a noncustomizable symbol, the SF Symbols app badges it with an Info icon; to help you use the symbol correctly, the inspector pane describes its usage restrictions.

Using a process called annotating, you can assign a specific color — or a specific hierarchical level, such as primary, secondary, or tertiary — to each layer in a custom symbol. Depending on the rendering modes you support, you can use a different mode in each instance of the symbol in your app.

Use the template as a guide. Create a custom symbol that’s consistent with the ones the system provides in level of detail, optical weight, alignment, position, and perspective. Strive to design a symbol that is:

- Simple

- Recognizable

- Inclusive

- Directly related to the action or content it represents

For guidance, see .

Assign negative side margins to your custom symbol if necessary. SF Symbols supports negative side margins to aid optical horizontal alignment when a symbol contains a badge or other elements that increase its width. For example, negative side margins can help you horizontally align a stack of folder symbols, some of which include a badge. The name of each margin includes the relevant configuration  — such as “left-margin-Regular-M” — so be sure to use this naming pattern if you add margins to your custom symbols.

Optimize layers to use animations with custom symbols. If you want to animate your symbol by layer, make sure to annotate the layers in the SF Symbols app. The Z-order determines the order that you want to apply colors to the layers of a variable color symbol, and you can choose whether to animate those changes from front-to-back, or back-to-front. You can also animate by layer groups to have related layers move together.

Test animations for custom symbols. It’s important to test your custom symbols with all of the animation presets because the shapes and paths might not appear how you expect when the layers are in motion. To get the most out of this feature, consider drawing your custom symbols with whole shapes. For example, a custom symbol similar to the `person.2.fill` symbol doesn’t need to create a cutout for the shape representing the person on the left. Instead, you can draw the full shape of the person, and in addition to that, draw an offset path of the person on the right to help represent the gap between them. You can later annotate this offset path as an erase layer to render the symbol as you want. This method of drawing helps preserve additional layer information that allows for animations to perform as you expect.

Avoid making custom symbols that include common variants, such as enclosures or badges. The SF Symbols app offers a component library for creating variants of your custom symbol. Using the component library allows you to create commonly used variants of your custom symbol while maintaining design consistency with the included SF Symbols.

Provide alternative text labels for custom symbols. Alternative text labels — or accessibility descriptions — let VoiceOver describe visible UI and content, making navigation easier for people with visual disabilities. For guidance, see .

Don’t design replicas of Apple products. Apple products are copyrighted and you can’t reproduce them in your custom symbols. Also, you can’t customize a symbol that SF Symbols identifies as representing an Apple feature or product.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — Symbols framework

 — UIKit

 — UIKit


##### Videos


### Change log

---

## Typography

`/design/human-interface-guidelines/typography`

_Your typographic choices can help you display legible text, convey an information hierarchy, communicate important content, and express your brand or style._


### Ensuring legibility

Use font sizes that most people can read easily. People need to be able to read your content at various viewing distances and under a variety of conditions. Follow the recommended default and minimum text sizes for each platform — for both custom and system fonts — to ensure your text is legible on all devices. Keep in mind that font weight can also impact how easy text is to read. If you use a custom font with a thin weight, aim for larger than the recommended sizes to increase legibility.

Test legibility in different contexts. For example, you need to test game text for legibility on each platform on which your game runs. If testing shows that some of your text is difficult to read, consider using a larger type size, increasing contrast by modifying the text or background colors, or using typefaces designed for optimized legibility, like the system fonts.

In general, avoid light font weights. For example, if you’re using system-provided fonts, prefer Regular, Medium, Semibold, or Bold font weights, and avoid Ultralight, Thin, and Light font weights, which can be difficult to see, especially when text is small.


### Conveying hierarchy

Adjust font weight, size, and color as needed to emphasize important information and help people visualize hierarchy. Be sure to maintain the relative hierarchy and visual distinction of text elements when people adjust text sizes.

Minimize the number of typefaces you use, even in a highly customized interface. Mixing too many different typefaces can obscure your information hierarchy and hinder readability, in addition to making an interface feel internally inconsistent or poorly designed.

Prioritize important content when responding to text-size changes. Not all content is equally important. When someone chooses a larger text size, they typically want to make the content they care about easier to read; they don’t always want to increase the size of every word on the screen. For example, when people increase text size to read the content in a tabbed window, they don’t expect the tab titles to increase in size. Similarly, in a game, people are often more interested in a character’s dialog than in transient hit-damage values.


### Using system fonts

Apple provides two typeface families that support an extensive range of weights, sizes, styles, and languages.

San Francisco (SF) is a sans serif typeface family that includes the SF Pro, SF Compact, SF Arabic, SF Armenian, SF Georgian, SF Hebrew, and SF Mono variants.

The system also offers SF Pro, SF Compact, SF Arabic, SF Armenian, SF Georgian, and SF Hebrew in rounded variants you can use to coordinate text with the appearance of soft or rounded UI elements, or to provide an alternative typographic voice.

New York (NY) is a serif typeface family designed to work well by itself and alongside the SF fonts.

You can download the San Francisco and New York fonts .

The system provides the SF and NY fonts in the variable font format, which combines different font styles together in one file, and supports interpolation between styles to create intermediate ones.

> [NOTE] Variable fonts support optical sizing, which refers to the adjustment of different typographic designs to fit different sizes. On all platforms, the system fonts support dynamic optical sizes, which merge discrete optical sizes (like Text and Display) and weights into a single, continuous design, letting the system interpolate each glyph or letterform to produce a structure that’s precisely adapted to the point size. With dynamic optical sizes, you don’t need to use discrete optical sizes unless you’re working with a design tool that doesn’t support all the features of the variable font format.

To help you define visual hierarchies and create clear and legible designs in many different sizes and contexts, the system fonts are available in a variety of weights, ranging from Ultralight to Black, and — in the case of SF — several widths, including Condensed and Expanded. Because SF Symbols use equivalent weights, you can achieve precise weight matching between symbols and adjacent text, regardless of the size or style you choose.

> [NOTE]  provides a comprehensive library of symbols that integrate seamlessly with the San Francisco system font, automatically aligning with text in all weights and sizes. Consider using symbols when you need to convey a concept or depict an object, especially within text.

The system defines a set of typographic attributes — called text styles — that work with both typeface families. A text style specifies a combination of font weight, point size, and leading values for each text size. For example, the body text style uses values that support a comfortable reading experience over multiple lines of text, while the headline style assigns a font size and weight that help distinguish a heading from surrounding content. Taken together, the text styles form a typographic hierarchy you can use to express the different levels of importance in your content. Text styles also allow text to scale proportionately when people change the system’s text size or make accessibility adjustments, like turning on Larger Text in Accessibility settings.

Consider using the built-in text styles. The system-defined text styles give you a convenient and consistent way to convey your information hierarchy through font size and weight. Using text styles with the system fonts also ensures support for Dynamic Type and larger accessibility type sizes (where available), which let people choose the text size that works for them. For guidance, see .

Modify the built-in text styles if necessary. System APIs define font adjustments — called symbolic traits — that let you modify some aspects of a text style. For example, the bold trait adds weight to text, letting you create another level of hierarchy. You can also use symbolic traits to adjust leading if you need to improve readability or conserve space. For example, when you display text in wide columns or long passages, more space between lines (loose leading) can make it easier for people to keep their place while moving from one line to the next. Conversely, if you need to display multiple lines of text in an area where height is constrained — for example, in a list row — decreasing the space between lines (tight leading) can help the text fit well. If you need to display three or more lines of text, avoid tight leading even in areas where height is limited. For developer guidance, see .

> [NOTE] You can use the constants defined in  to access all system fonts — don’t embed system fonts in your app or game. For example, use  to get the system font on all platforms; use  to get the New York font.

If necessary, adjust tracking in interface mockups. In a running app, the system font dynamically adjusts tracking at every point size. To produce an accurate interface mockup of an interface that uses the variable system fonts, you don’t have to choose a discrete optical size at certain point sizes, but you might need to adjust the tracking. For guidance, see .


### Using custom fonts

Make sure custom fonts are legible. People need to be able to read your custom font easily at various viewing distances and under a variety of conditions. While using a custom font, be guided by the recommended minimum font sizes for various styles and weights in .

Implement accessibility features for custom fonts. System fonts automatically support Dynamic Type (where available) and respond when people turn on accessibility features, such as Bold Text. If you use a custom font, make sure it implements the same behaviors. For developer guidance, see . In a Unity-based game, you can use  to support Dynamic Type. If the plug-in isn’t appropriate for your game, be sure to let players adjust text size in other ways.


### Supporting Dynamic Type

Dynamic Type is a system-level feature in iOS, iPadOS, tvOS, visionOS, and watchOS that lets people adjust the size of visible text on their device to ensure readability and comfort. For related guidance, see .

For a list of available Dynamic Type sizes, see . You can also download Dynamic Type size tables in the  for each platform.

For developer guidance, see . To support Dynamic Type in Unity-based games, use .

Make sure your app’s layout adapts to all font sizes. Verify that your design scales, and that text and glyphs are legible at all font sizes. On iPhone or iPad, turn on Larger Accessibility Text Sizes in Settings > Accessibility > Display & Text Size > Larger Text, and confirm that your app remains comfortably readable.

Increase the size of meaningful interface icons as font size increases. If you use interface icons to communicate important information, make sure they’re easy to view at larger font sizes too. When you use , you get icons that scale automatically with Dynamic Type size changes.

Keep text truncation to a minimum as font size increases. In general, aim to display as much useful text at the largest accessibility font size as you do at the largest standard font size. Avoid truncating text in scrollable regions unless people can open a separate view to read the rest of the content. You can prevent text truncation in a label by configuring it to use as many lines as needed to display a useful amount of text. For developer guidance, see .

Consider adjusting your layout at large font sizes. When font size increases in a horizontally constrained context, inline items (like glyphs and timestamps) and container boundaries can crowd text and cause truncation or overlapping. To improve readability, consider using a stacked layout where text appears above secondary items. Multicolumn text can also be less readable at large sizes due to horizontal space constraints. Reduce the number of columns when the font size increases to avoid truncation and enhance readability. For developer guidance, see .

Maintain a consistent information hierarchy regardless of the current font size. For example, keep primary elements toward the top of a view even when the font size is very large, so that people don’t lose track of these elements.


### Platform considerations


#### iOS, iPadOS

SF Pro is the system font in iOS and iPadOS. iOS and iPadOS apps can also use NY.


#### macOS

SF Pro is the system font in macOS. NY is available for Mac apps built with Mac Catalyst. macOS doesn’t support Dynamic Type.

When necessary, use dynamic system font variants to match the text in standard controls. Dynamic system font variants give your text the same look and feel of the text that appears in system-provided controls. Use the variants listed below to achieve a look that’s consistent with other apps on the platform.


#### tvOS

SF Pro is the system font in tvOS, and apps can also use NY.


#### visionOS

SF Pro is the system font in visionOS. If you use NY, you need to specify the type styles you want.

visionOS uses bolder versions of the Dynamic Type body and title styles and it introduces Extra Large Title 1 and Extra Large Title 2 for wide, editorial-style layouts. For guidance using vibrancy to indicate hierarchy in text and symbols, see .

In general, prefer 2D text. The more visual depth text characters have, the more difficult they can be to read. Although a small amount of 3D text can provide a fun visual element that draws people’s attention, if you’re going to display content that people need to read and understand, prefer using text that has little or no visual depth.

Make sure text looks good and remains legible when people scale it. Use a text style that makes the text look good at full scale, then test it for legibility at different scales.

Maximize the contrast between text and the background of its container. By default, the system displays text in white, because this color tends to provide a strong contrast with the default system background material, making text easier to read. If you want to use a different text color, be sure to test it in a variety of contexts.

If you need to display text that’s not on a background, consider making it bold to improve legibility. In this situation, you generally want to avoid adding shadows to increase text contrast. The current space might not include a visual surface on which to cast an accurate shadow, and you can’t predict the size and density of shadow that would work well with a person’s current Environment.

Keep text facing people as much as possible. If you display text that’s associated with a point in space, such as a label for a 3D object, you generally want to use billboarding — that is, you want the text to face the wearer regardless of how they or the object move. If you don’t rotate text to remain facing the wearer, the text can become impossible to read because people may view it from the side or a highly oblique angle. For example, imagine a virtual lamp that appears to be on a physical desk with a label anchored directly above it. For the text to remain readable, the label needs to rotate around the y-axis as people move around the desk; in other words, the baseline of the text needs to remain perpendicular to the person’s line of sight.


#### watchOS

SF Compact is the system font in watchOS, and apps can also use NY. In complications, watchOS uses SF Compact Rounded.


### Specifications

You can display emphasized variants of system text styles using symbolic traits. In SwiftUI, use the  modifier; in UIKit, use  in the  API. The emphasized weights can be medium, semibold, bold, or heavy. The following specifications include the emphasized weight for each text style.


#### iOS, iPadOS Dynamic Type sizes


#### iOS, iPadOS larger accessibility type sizes


#### macOS built-in text styles


#### tvOS built-in text styles


#### watchOS Dynamic Type sizes


#### watchOS larger accessibility type sizes


#### Tracking values


##### iOS, iPadOS, visionOS tracking values


##### macOS tracking values


##### tvOS tracking values


##### watchOS tracking values


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Writing

`/design/human-interface-guidelines/writing`

_The words you choose within your app are an essential part of its user experience._

Whether you’re building an onboarding experience, writing an alert, or describing an image for accessibility, designing through the lens of language will help people get the most from your app or game.


### Getting started

Determine your app’s voice. Think about who you’re talking to, so you can figure out the type of vocabulary you’ll use. What types of words are familiar to people using your app? How do you want people to feel? The words for a banking app might convey trust and stability, for example, while the words in a game might convey excitement and fun. Create a list of common terms, and reference that list to keep your language consistent. Consistent language, along with a voice that reflects your app’s values, helps everything feel more cohesive.

Match your tone to the context. Once you’ve established your app’s voice, vary your tone based on the situation. Consider what people are doing while they’re using your app — both in the physical world and within the app itself. Are they exercising and reached a goal? Or are they trying to make a payment and received an error? Situational factors affect both what you say and how you display the text on the screen.

Compare the tone of these two examples from Apple Watch. In the first, the tone is straightforward and direct, reflecting the seriousness of the situation. In the second, the tone is light and congratulatory.

Be clear. Choose words that are easily understood and convey the right thing. Check each word to be sure it needs to be there. If you can use fewer words, do so. When in doubt, read your writing out loud.

Write for everyone. For your app to be useful for as many people as possible, it needs to speak to as many people as possible. Choose simple, plain language and write with accessibility and localization in mind, avoiding jargon and gendered terminology. For guidance, see  and ; for developer guidance, see .


### Best practices

Consider each screen’s purpose. Pay attention to the order of elements on a screen, and put the most important information first. Format your text to make it easy to read. If you’re trying to convey more than one idea, consider breaking up the text onto multiple screens, and think about the flow of information across those screens.

Be action oriented. Active voice and clear labels help people navigate through your app from one step to the next, or from one screen to another. When labeling buttons and links, it’s almost always best to use a verb. Prioritize clarity and avoid the temptation to be too cute or clever with your labels. For example, just saying “Send” often works better than “Let’s do it!” For links, avoid using “Click here” in favor of more descriptive words or phrases, such as “Learn more about UX Writing.” This is especially important for people using screen readers to access your app.

Build language patterns. Consistency builds familiarity, helping your app feel cohesive, intuitive, and thoughtfully designed. It also makes writing for your app easier, as you can return to these patterns again and again.

Adopt capitalization rules that align with your app’s style, then apply them consistently. While certain components, like , have specific guidelines, how you format text reflects your app’s voice. Title case is generally considered formal, while sentence case is more casual. Choose a style for each UI element type and use it consistently throughout your app — for example, title case for all alerts or sentence case for all headlines.

Give clear guidance and use consistent language throughout processes with multiple steps. If your app has a flow that spans multiple screens, decide how you want to label the actions that take people from one step to the next. Begin with language like “Get Started” to indicate you’re starting a flow. You can use the button label to hint at the next step, or use terms like “Continue” or “Next,” but be consistent with what you choose. Make it clear when a flow is complete by using language like “Done.”

Use possessive pronouns sparingly. Possessive pronouns like my and your are often unnecessary to establish context. For example, “Favorites” conveys the same message as “Your Favorites,” and is more succinct. If you do use possessive pronouns, use them consistently throughout your app, and try not to switch perspectives. Avoid using we altogether because it may be unclear who the “we” in question refers to. This is particularly problematic in error messages like “We’re having trouble loading this content.” Something like “Unable to load content” is much clearer.

Write for how people use each device. People may use your app on several types of devices. While your language needs to be consistent across them, think about where it would be helpful to adjust your text to make it suitable for different devices. Make sure you describe gestures correctly on each device — for example, not saying “click” for a touch device like iPhone or iPad where you mean “tap.”

Where and how people use a device, its screen size, and its location all affect how you write for your app. iPhone and Apple Watch, for example, offer opportunities for personalization, but their small screens require brevity. TVs, on the other hand, are often in common living spaces, and several people are likely to see anything on the screen, so consider who you’re addressing. Bigger screens also require brevity, as the text must be large for people to see it from a distance.

Provide clear next steps on any blank screens. An empty state, like a completed to-do list or bookmarks folder with nothing in it, can provide a good opportunity to make people feel welcome and educate them about your app. Empty states can also showcase your app’s voice, but make sure that the content is useful and fits the context. An empty screen can be daunting if it isn’t obvious what to do next, so guide people on actions they can take, and give them a button or link to do so if possible. Remember that empty states are usually temporary, so don’t show crucial information that could then disappear.

Write clear error messages. It’s always best to help people avoid errors. When an error message is necessary, display it as close to the problem as possible, avoid blame, and be clear about what someone can do to fix it. For example, “That password is too short” isn’t as helpful as “Choose a password with at least 8 characters.” Remember that errors can be frustrating. Interjections like “oops!” or “uh-oh” are typically unnecessary and can sound insincere. If you find that language alone can’t address an error that’s likely to affect many people, use that as an opportunity to rethink the interaction.

Choose the right delivery method. There are many ways to get people’s attention, whether or not they are actively using your app. When there’s something you want to communicate, consider the urgency and importance of the message. Think about the context in which someone might see the message, whether it requires immediate action, and how much supporting information someone might need. Choose the correct delivery method, and use a tone appropriate for the situation. For guidance, see , , and .

Keep settings labels clear and simple. Help people easily find the settings they need by labeling them as practically as possible. If the setting label isn’t enough, add an explanation. Describe what it does when turned on, and people can infer the opposite. In the Handwashing Timer setting for Apple Watch, for example, the description explains that a timer can start when you’re washing your hands. It isn’t necessary to tell you that a timer won’t start when this setting is off.

If you need to direct someone to a setting, provide a direct link or button, rather than trying to describe its location. For guidance, see .

Show hints in text fields. If your app allows people to enter their own text, like account or contact information, label all fields clearly, and use hint or placeholder text so people know how to format the information. You can give an example in hint text, like “name@example.com,” or describe the information, such as “Your name.” Show errors right next to the field, and instruct people how to enter the information correctly, rather than scolding them for not following the rules. “Use only letters for your name” is better than “Don’t use numbers or symbols.” Avoid robotic error messages with no helpful information, like “Invalid name.” For guidance, see .


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Videos


### Change log

---

## Charting data

`/design/human-interface-guidelines/charting-data`

_Presenting data in a chart can help you communicate information with clarity and appeal._

Charts provide efficient ways to communicate complex information without requiring people to read and interpret a lot of text. The graphical nature of charts also gives you additional opportunities to express the personality of your experience and add visual interest to your interface. To learn about the components you use to create a chart, see .

A chart can range from a simple graphic that provides glanceable information to a rich, interactive experience that can form the centerpiece of your app and encourage people to explore the data from various perspectives. Whether simple or complex, you can use charts to help people perform data-driven tasks that are important to them, such as:

- Analyzing trends based on historical or predicted values

- Visualizing the current state of a process, system, or quantity that changes over time

- Evaluating different items — or the same item at different times — by comparing data across multiple categories

Not every collection of data needs to be displayed in a chart. If you simply need to provide data — and you don’t need to convey information about it or help people analyze it — consider offering the data in other ways, such as in a list or table that people can scroll, search, and sort.


### Best practices

Use a chart when you want to highlight important information about a dataset. Charts are visually prominent, so they tend to draw people’s attention. Take advantage of this prominence by clearly communicating what people can learn from the data they care about.

Keep a chart simple, letting people choose when they want additional details. Resist the temptation to pack as much data as possible into a chart. Too much data can make a chart visually overwhelming and difficult to use, obscuring the relationships and other information you want to convey. If you have a lot of data to present — or a lot of functionality to provide — consider giving people a way to reveal it gradually. For example, you might let people choose to view different levels of detail or subsets of data to match their interest. To help people learn how to use an interactive chart, you might offer several versions of the chart, each with more functionality than the last.

Make every chart in your app accessible. A chart communicates visually through graphical representations of data and visual descriptions. In addition to the visual descriptions you display, it’s crucial to provide both accessibility labels that describe chart values and components, and accessibility elements that help people interact with the chart. For guidance, see .


### Designing effective charts

In general, prefer using common chart types. People tend to be familiar with common chart types — such as bar charts and line charts — so using one of these types in your app can make it more likely that people will already know how to read your chart. For guidance, see .

If you need to create a chart that presents data in a novel way, help people learn how to interpret the chart. For example, when a Watch pairs with iPhone, Activity introduces the Activity rings by animating them individually, showing people how each ring maps to the move, exercise, and stand metrics.

Examine the data from multiple levels or perspectives to find details you can display to enhance the chart. For example, viewing the data from a macro level can help you determine high-level summaries that people might be interested in, like totals or averages. From a mid-level perspective, you might find ways to help people identify useful subsets of the data, whereas examining individual data points might help you find ways to draw people’s attention to specific values or items. Displaying information that helps people view the chart from various perspectives can encourage them to engage with it.

Aid comprehension by adding descriptive text to the chart. Descriptive text titles, subtitles, and annotations help emphasize the most important information in a chart and can highlight actionable takeaways. You can also display brief descriptive text that serves as a headline or summary for a chart, helping people grasp essential information at a glance. For example, Weather displays text that summarizes the information people need right now — such as “Chance of light rain in the next hour” — above the scrolling list of hourly forecasts for the next 24 hours. Although a descriptive headline or summary can make a chart more accessible, it doesn’t take the place of accessibility labels.

Match the size of a chart to its functionality, topic, and level of detail. In general, a chart needs to be large enough to comfortably display the details you need to include and expansive enough for the interactivity you want to support. For example, you always want to make it easy for people to read a chart’s details and descriptive text — like labels and annotations — but you might also want to give people enough room to change the scope of a chart or investigate the data from different perspectives. On the other hand, you might want to use a small chart to offer glanceable information about an individual item or to provide a snapshot or preview of a larger version of the chart that people can reveal in a different view.

Prefer consistency across multiple charts, deviating only when you need to highlight differences. If multiple charts in your app serve a similar purpose, you generally don’t want to imply that the charts are unrelated by using a different type or style for each one.  Also, using a consistent visual approach for the charts in your app lets people use what they learn about one chart to help them understand another. Consider using different chart types and styles when you need to highlight meaningful differences between charts.

Maintain continuity among multiple charts that use the same data. When you use multiple charts to help people explore one dataset from different perspectives, it’s important to use one chart type and consistent colors, annotations, layouts, and descriptive text to signal that the dataset remains the same. For example, the Health Trends screen shows small charts that each use a specific visual style to depict a recent trend in an area like steps or resting heart rate. When people choose a chart to reveal all their data in that area, the expanded version uses the same style, colors, marks, and annotations to strengthen the relationship between the versions.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## Collaboration and sharing

`/design/human-interface-guidelines/collaboration-and-sharing`

_Great collaboration and sharing experiences are simple and responsive, letting people engage with the content while communicating effectively with others._

System interfaces and the Messages app can help you provide consistent and convenient ways for people to collaborate and share. For example, people can share content or begin a collaboration by dropping a document into a Messages conversation or selecting a destination in the familiar share sheet.

After a collaboration begins, people can use the Collaboration button in your app to communicate with others, perform custom actions, and manage details. In addition, people can receive Messages notifications when collaborators mention them, make changes, join, or leave.

You can take advantage of Messages integration and the system-provided sharing interfaces whether you implement collaboration and sharing through CloudKit, iCloud Drive, or a custom solution. To offer these features when you use a custom collaboration infrastructure, make sure your app also supports universal links (for developer guidance, see ).

In addition to helping people share and collaborate on documents, visionOS supports immersive sharing experiences through SharePlay. For guidance, see .


### Best practices

Place the Share button in a convenient location, like a toolbar, to make it easy for people to start sharing or collaborating. In iOS 16, the system-provided share sheet includes ways to choose a file-sharing method and set permissions for a new collaboration; iPadOS 16 and macOS 13 introduce similar appearance and functionality in the sharing popover. In your SwiftUI app, you can also enable sharing by presenting a share link that opens the system-provided share sheet when people choose it; for developer guidance, see .

If necessary, customize the share sheet or sharing popover to offer the types of file sharing your app supports. If you use CloudKit, you can add support for sending a copy of a file by passing both the file and your collaboration object to the share sheet. Because the share sheet has built-in support for multiple items, it automatically detects the file and makes the “send copy” functionality available. With iCloud Drive, your collaboration object supports “send copy” functionality by default. For custom collaboration, you can support “send copy” functionality in the share sheet by including a file — or a plain text representation of it — in your collaboration object.

Write succinct phrases that summarize the sharing permissions you support. For example, you might write phrases like “Only invited people can edit” or “Everyone can make changes.” The system uses your permission summary in a button that reveals a set of sharing options that people use to define the collaboration.

Provide a set of simple sharing options that streamline collaboration setup. You can customize the view that appears when people choose the permission summary button to provide choices that reflect your collaboration functionality. For example, you might offer options that let people specify who can access the content and whether they can edit it or just read it, and whether collaborators can add new participants. Keep the number of custom choices to a minimum and group them in ways that help people understand them at a glance.

Prominently display the Collaboration button as soon as collaboration starts. The system-provided Collaboration button reminds people that the content is shared and identifies who’s sharing it. Because the Collaboration button typically appears after people interact with the share sheet or sharing popover, it works well to place it next to the Share button.

Provide custom actions in the collaboration popover only if needed. Choosing the Collaboration button in your app reveals a popover that consists of three sections. The top section lists collaborators and provides communication buttons that can open Messages or FaceTime, the middle section contains your custom items, and the bottom section displays a button people use to manage the shared file. You don’t want to overwhelm people with too much information, so it’s crucial to offer only the most essential items that people need while they use your app to collaborate. For example, Notes summarizes the most recent updates and provides buttons that let people get more information about the updates or view more activities.

If it makes sense in your app, customize the title of the modal view’s collaboration-management button. People choose this button — titled “Manage Shared File” by default — to reveal the collaboration-management view where they can change settings and add or remove collaborators. If you use CloudKit sharing, the system provides a management view for you; otherwise, you create your own.

Consider posting collaboration event notifications in Messages. Choose the type of event that occurred — such as a change in the content or the collaboration membership, or the mention of a participant — and include a universal link people can use to open the relevant view in your app. For developer guidance, see .


### Platform considerations

No additional considerations for iOS, iPadOS, or macOS. Not available in tvOS.


#### visionOS

By default, the system supports screen sharing for an app running in the Shared Space by streaming the current window to other collaborators. If one person transitions the app to a Full Space while sharing is in progress, the system pauses the stream for other people until the app returns to the Shared Space. For guidance, see .


#### watchOS

In your SwiftUI app running in watchOS, use  to present the system-provided share sheet.


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos


### Change log

---

## Drag and drop

`/design/human-interface-guidelines/drag-and-drop`

_Using drag and drop, people can move or duplicate selected photos, text, and other content by dragging the selection from one location to another._

To perform drag and drop, people select content in one location, called the source, and drop it in another, called the destination. These locations can be in the same container — like a text view — or in different containers, like text views on opposite sides of a split view, or even in different apps.

Depending on various factors, the drag and drop action might move the selected content to the destination or copy it. After a successful drop, moved content exists only in the destination; copied content exists in both locations. As a general rule, dropping selected content within the same container moves it, whereas dropping content in a different container copies it. Dragging and dropping content between apps always results in a copy.

People use different interactions to perform drag and drop depending on platform. For example:

- In visionOS, people pinch and hold a virtual object while dragging it to a new location in any direction, including along the z-axis.

- iOS and iPadOS support drag and drop through gestures on the touchscreen, interactions with a pointing device, and through full keyboard-access mode.

- Universal Control lets people drag content between their Mac and iPad.

- On a Mac, people can interact with a pointing device, use full keyboard access mode, or use VoiceOver to perform drag and drop.


### Best practices

As much as possible, support drag and drop throughout your app. Most people are familiar with drag and drop and they often try it everywhere. When you use system-provided components — such as text fields and text views — you get built-in support for drag and drop.

Offer alternative ways to accomplish drag-and-drop actions. Sometimes, drag-and-drop operations are inconvenient or impossible for people to perform, so it’s important to provide other ways to do the same things. For example, you can include menu commands that people can use to copy an item and move it to another location. In iOS and iPadOS, you can use accessibility APIs to identify sources and destinations so that people can use assistive technologies to drag and drop in your app (for developer guidance, see  and ).

Determine when dragging and dropping content within your app results in a move or a copy. In general, a move makes sense when the source and destination containers are the same — such as dragging text from one location to another within a document — and a copy makes sense when they’re different, like dragging an image from one document to another. Before you change these defaults, consider the behavior that most people expect and prefer the one that is least likely to result in frustration or data loss.

Support multi-item drag and drop when it makes sense. People appreciate the convenience of dragging a group of items to a destination, instead of dragging each item separately. In iOS, iPadOS, macOS, and visionOS, people can select multiple items and drag them as a group; macOS also lets people select multiple items from several apps and drag them as a group. In iPadOS, people can select an item, start dragging it, and add other items to the group without stopping the drag operation.

Prefer letting people undo a drag-and-drop operation. Sometimes, people inadvertently drop content in the wrong destination, so they appreciate being able to undo the action and return to their previous state. You might also be able to help people avoid mistakes by asking for confirmation before completing a drag-and-drop operation that can’t be undone. In macOS, for example, the Finder asks for confirmation when people drag a file into a write-only folder because they won’t be able to open the folder and remove the dropped item. In some situations, it might make sense to provide a way to reverse the results of drag and drop when people can’t undo it. For example, Photos lets people cancel photo sharing after dropping a photo into a shared photo stream.

Consider offering multiple versions of dragged content, ordered from highest to lowest fidelity. By providing multiple alternatives, the destination can choose the highest quality version it can accept. For example, if people can drag a line drawing they created in your app, you could offer a PDF vector representation, a lossless PNG image with transparency, and a lossy JPEG image without transparency, in that order. Another example is an app that uses rich, complicated objects, like charts. This app might offer the native chart object followed by a simpler version — like an image of the chart — for destinations that don’t support chart objects.

Consider supporting spring loading. Spring loading lets people activate certain controls, like buttons and segmented controls, by dragging selected content over them. For example, Calendar lets people drag a selected event over the day, week, month, or year segments in the toolbar, giving them a convenient way to move the event to a different date. On a Mac equipped with a Magic Trackpad, a button or segmented control can activate when people force-click it while continuing to hold the content; on iPad, these components can activate when people hover over them while holding the content.


### Providing feedback

Drag and drop is a dynamic process that can result in multiple outcomes. To help people feel in control the process, it’s crucial to provide clear and continuous feedback throughout.

Display a drag image as soon as people drag a selection about three points. It works well to create a translucent representation of the content people are dragging. Translucency helps distinguish the representation from the original content and lets people see destinations as they pass over them. Display the drag image until people drop the content.

If it adds clarity, modify the drag image to help people predict the result of a drag-and-drop operation. For example, when dragging a photo into a document, the drag image could expand to show the default size of the photo in the document. You can also use drag flocking to visually group multiple drag items — letting people confirm that they haven’t missed an item they want to drag — and then ungroup the items when people drop them. Although changing the drag image can provide valuable feedback, avoid creating a distracting experience in which the drag image is constantly and radically changing.

Show people whether a destination can accept dragged content. For example, you might display an insertion point or highlight a containing view only when the destination can accept a dragged item, and show no visual feedback — or an explicit “not allowed” image, like the `circle.slash` from SF Symbols — when it can’t. Display highlighting or other visual cues only while the content is positioned above the destination, removing the visual feedback when people drag the content away. When there are multiple possible destinations, provide visual cues that help people identify one at a time.

When people drop an item on an invalid destination, or when dropping fails, provide visual feedback. For example, the item can move back from its current location to its source (if the source is still visible) or it can scale up and fade out to give the impression of the item evaporating instead of landing successfully.


### Accepting drops

Scroll the contents of a destination when necessary. When people drag an item within a scrolling container that has a lot of content, the content can automatically scroll as people move the item over it. This behavior makes it easy for people to find the right place to drop the item, but if they continue the drag operation outside of the container, automatic scrolling is no longer necessary. System-provided text views and text fields behave this way by default.

When there’s a choice, pick the richest version of dropped content your app can accept. For example, if people drag a chart object from another app, the drag operation might offer both the rich, native chart object and a simple image of it. If your app supports charts, extract and display the native chart object; it it doesn’t, use the image instead.

Extract only the relevant portion of dropped content if necessary. For example, when people drag a contact to a recipient field in an email, Mail displays only the name and email address, not the contact’s address information.

When a physical keyboard is attached, check for the Option key at drop time. When people hold the Option key while dragging, they can force a drag-and-drop operation within the same container to behave like a copy. If people stop holding Option before dropping content in the same container, the drag operation results in a move.

Provide feedback when dropped content needs time to transfer. For example, you might display a progress indicator to help people estimate how long the transfer will take. In collections, lists, and tables, you might also display a placeholder at the drop location so people know where to find the content after it finishes transferring. The system can display an alert when a time-consuming transfer occurs between apps.

Provide feedback when dropped content initiates a task or action. If people drop content onto a control that initiates a task — such as printing — show people that the task has begun and keep them informed of its progress.

Apply appropriate styling to dropped text. When the source and destination both support the same text styles, make sure dropped text maintains its original font, typeface, size, and other attributes. Otherwise, apply the destination’s style to dropped text.

After a drop, maintain the content’s selection state in the destination, updating it in the source as needed. People expect the content they drop to remain selected so they can immediately act on it. When the source and destination are the same container, the content disappears from its original location when the drag operation performs a move. When a drag operation within the same container performs a copy, remove the selection state from the content that remains in the original location. When people drag selected content to a different container, deselect the content in the source.


### Platform considerations

Not supported in tvOS or watchOS.


#### iOS, iPadOS

Let people perform multiple simultaneous drag activities. In iPadOS, people can sequentially add items to an in-progress drag session, gathering as many items as their fingers can handle. For example, people can select an app icon on the Home Screen, start dragging it, and select additional app icons before dropping all of them in a different Home Screen or in a folder. To support this interaction, you need to let people add items during a drag — providing visual feedback through flocking — and accept multiple, simultaneous drops.


#### macOS

Consider letting people drag content from your app into the Finder. When you support this, be sure to present the content in a format your app can open later. For example, Calendar lets people drag an event to the Finder as a `.ics` file. People can share this file with others or drag it back to Calendar to open it. When necessary, you can output dragged content in a clipping, which is a temporary container for storing dragged content. For example, most system apps let people drag text to the Finder, where it appears as a clipping. Later, people can drag the clipping into a text field or other location that accepts text. Note that a drag-and-drop clipping isn’t related to the Clipboard.

Let people drag selected content from an inactive window without first making the window active. Selected content in an inactive window is known as a background selection and has a different appearance from selected content in the active window. In general, people expect to drag a background selection to the active window without bringing the inactive window forward.

When possible, let people drag individual items from an inactive window without affecting an existing background selection. For example, people can drag an unselected file from an inactive Finder window without deselecting any of the window’s selected files.

Consider displaying a badge during multi-item drag operations. A badge is a small filled oval containing a number you can use to indicate the number of items people are dragging. If a destination can accept only a subset of dragged items, update the badge to show the new number.

Consider changing the pointer appearance to indicate what will happen when people drop content. In addition to using the copy pointer, you might want to use the drag link, disappearing item, and operation not allowed pointers, depending on the situation. For guidance, see .

As much as possible, let people select and drag content with a single motion. Unless people are selecting multiple items, they appreciate it when they don’t have to pause between making a selection and starting the drag operation.


#### visionOS

When possible, launch your app to handle content that people drop into empty space. When you associate a user activity with draggable app content, your app can open a window or scene that handles the content when people drop it. For example, when people drop a URL into empty space, it launches Safari; when people drop Quick Look–supported content, Quick Look launches to display it. For developer guidance, see .


### Resources


##### Related


##### Developer documentation

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Entering data

`/design/human-interface-guidelines/entering-data`

_When you need information from people, design ways that make it easy for them to provide it without making mistakes._

Entering information can be a tedious process regardless of the interaction methods people use. Improve the experience by:

- Pre-gathering as much information as possible to minimize the amount of data that people need to supply

- Supporting all available input methods so people can choose the method that works for them


### Best practices

Get information from the system whenever possible. Don’t ask people to enter information that you can gather automatically — such as from settings — or by getting their permission, such as their location or calendar information.

Be clear about the data you need. For example, you might display a prompt in a text field — like “username@company.com” — or provide an introductory label that describes the information, like “Email.” You can also prefill fields with reasonable default values, which can minimize decision making and speed data entry.

Use a secure text-entry field when appropriate. If your app or game needs sensitive data, use a field that obscures people’s input as they enter it, typically by displaying a small filled circle symbol for each character. For developer guidance, see . In tvOS, you can also configure a  to obscure the numerals people enter (for developer guidance, see ). When you use the system-provided text field in visionOS, the system shows the entered data to the wearer, but not to anyone else; for example, a secure text field automatically blurs when people use AirPlay to stream their content.

Never prepopulate a password field. Always ask people to enter their password or use biometric or keychain authentication. For guidance, see .

When possible, offer choices instead of requiring text entry. It’s usually easier and more efficient to choose from lists of options than to type information, even when a keyboard is conveniently available. When it makes sense, consider using a picker, menu, or other selection component to give people an easy way to provide the information you need.

As much as possible, let people provide data by dragging and dropping it or by pasting it. Supporting these interactions can ease data entry and make your experience feel more integrated with the rest of the system.

Dynamically validate field values. People can get frustrated when they have to go back and correct mistakes after filling out a lengthy form. When you verify values as soon as people enter them — and provide feedback as soon as you detect a problem — you give them the opportunity to correct errors right away. For numeric data in particular, consider using a number formatter, which automatically configures a text field to accept only numeric values. You can also configure a formatter to display the value in a specific way, such as with a certain number of decimal places, as a percentage, or as currency.

When data entry is necessary, make sure people understand that they must provide the required data before they can proceed. For example, if you include a Next or Continue button after a set of text fields, make the button available only after people enter the data you require.


### Platform considerations

No additional considerations for iOS, iPadOS, tvOS, visionOS, or watchOS.


#### macOS

Consider using an expansion tooltip to show the full version of clipped or truncated text in a field. An expansion tooltip behaves like a regular tooltip, appearing when the pointer rests on top of a field. Apps running in macOS — including iOS and iPadOS apps running on a Mac — can use an expansion tooltip to help people view the complete data they entered when a text field is too small to display it. For guidance, see .


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos


### Change log

---

## Feedback

`/design/human-interface-guidelines/feedback`

_Feedback helps people know what’s happening, discover what they can do next, understand the results of actions, and avoid mistakes._

Providing clear, consistent feedback as people interact with your app or game can make it feel intuitive and encourage deeper exploration. Feedback can communicate several different things, such as:

- The current status of something

- The success or failure of an important task or action

- A warning about an action that can have negative consequences

- An opportunity to correct a mistake or problematic situation

The most effective feedback tends to match the significance of the information to the way it’s delivered. For example, it often works well to display status information in a passive way so that people can view it when they need it. In contrast, a warning about possible data loss needs to interrupt people so they have a chance to avoid the problem.


### Best practices

Make sure all feedback is accessible. When you use multiple ways to provide feedback, you reach more people and give them the opportunity to receive the feedback in ways that work for them. For example, when you provide feedback using color, text, sound, and haptics, people can receive it whether they silence their device, look away from the screen, or use VoiceOver. (For guidance on providing haptic feedback, see .)

Consider integrating status feedback into your interface. When status feedback is available near the items it describes, people get important information without having to take action or leave their current context. For example, Mail in iOS and iPadOS describes the most recent update and displays the number of unread messages in the toolbar of the mailbox screen, making the information unobtrusive but easy for people to check when they’re interested.

Use alerts to deliver critical — and ideally actionable — information. By design, alerts disrupt the current context, so you need to match the importance of the information to the level of interruption. Alerts can lose their impact if you use them too often or to deliver unimportant information. For guidance, see .

Warn people when they initiate a task that can cause data loss that’s unexpected and irreversible. In contrast, don’t warn people when data loss is the expected result of their action. For example, the Finder doesn’t warn people every time they throw away a file because deleting the file is the expected result.

When it makes sense, confirm that a significant action or task has completed. For example, people appreciate getting feedback that confirms a successful Apple Pay transaction. It’s generally best to reserve this type of confirmation for activities that are sufficiently important — because people typically expect their action or task to succeed, they only need to know when it doesn’t.

Show people when a command can’t be carried out and help them understand why. For example, if people request directions without specifying a destination, Maps tells them that it can’t provide directions to and from the same location.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, or visionOS.


#### watchOS

Avoid displaying an indeterminate progress indicator — such as a loading indicator — in a watchOS app. An animated indicator can make people think they need to continue paying attention to the display, which isn’t a good user experience. To provide a better experience, reassure people that they’ll receive a notification when the process completes.


### Resources


##### Related


##### Developer documentation

 — UIKit


##### Videos

---

## File management

`/design/human-interface-guidelines/file-management`

_Some apps can support documents and files that people expect to manage throughout the system._

Document-based apps — such as Pages, Keynote, Photos, and Preview — help people create, edit, and save documents and files, often providing customized ways for people to browse for content they want to open in the app.

People also expect to browse documents without first opening a document-based app. On a Mac, for example, people use the Finder to access the macOS file system; on iPhone, iPad, and Apple Vision Pro, people use the Files app to manage the documents and files on their device. In watchOS and tvOS, people don’t typically create, edit, or manage documents, so these systems don’t provide a document-browsing interface.


### Creating and opening files

Use app menus and keyboard shortcuts to give people convenient ways to create and open documents. In iPadOS and macOS, people expect to create new documents or open existing ones using familiar menu commands. When you provide commands like New or Open, iPadOS presents them in the shortcuts interface that displays when people hold the Command key on a connected hardware keyboard, and macOS presents them in the menu bar File menu. Regardless of the availability of keyboard shortcuts, include an Add (+) button to help people create a new document. In a macOS app, you put the add action in the File menu (for guidance, see ).

If your app requires a custom file browser, support people’s understanding of the platform’s file system. People who are familiar with the Finder and Files apps already understand the basic layout of their device’s file system. Although you might want to show the most relevant part of the file system when your custom file browser opens — for example, a Documents or iCloud folder or the most recently selected location — let people use your browser to view the rest of the file system if they want.


### Saving work

Help people be confident that their work is always preserved unless they cancel or delete it. In general, avoid making people take an explicit action to save their work. Instead, automatically perform periodic saves while they’re editing and when they close a file or switch to another app.

Hide file extensions by default, but let people view them if they choose. Be sure to reflect the current choice in all the save or open interfaces you display.


### Quick Look previews

Quick Look helps you create previews of the files your app handles so that people can view them within your app and in some cases interact with them. For example, you can use Quick Look to let people listen to a preview of an audio file, add markup to a photo’s preview, or rotate and scale a 3D file preview to examine it in different ways.

Use a Quick Look viewer to let people preview a file even when your app can’t open it. If your app lets people attach or otherwise interact with files that it doesn’t support, implementing a Quick Look viewer lets people preview those files without leaving your app.

Consider implementing a Quick Look generator if your app produces custom file types. A Quick Look generator lets other apps — including the Finder, Files, and Spotlight — display previews of your documents, making it easier for people to find them.


### Platform considerations

No additional considerations for tvOS, visionOS, or watchOS.


#### iOS, iPadOS


##### Document launcher

Starting in iOS 18 and iPadOS 18, document-based apps can use the system’s document launcher to give people a consistent, highly graphical way to browse, open, and create files. The document launcher presents a full-screen experience that highlights key elements of your app’s theme, while making it easy for people to create new documents. For developer guidance, see .

The document launcher consists of three main parts:

- A title card that displays the app title and two app-specific buttons

- A background image that appears behind the title card and additional images — called accessories — that can appear around it

- A sheet that contains a file browser and optional app-specific controls

You can customize all three parts of the document launcher. Although the system automatically displays your app name in the title card, you specify the text and functions of the card’s primary and secondary buttons. You can also create a custom background image, one or more accessory images to surround the title card, and provide some custom controls that can appear in the file browser’s toolbar.

Assign the title card’s buttons to your app’s most important functions. The primary button typically creates a new document, and the secondary button can provide additional options. For example, the primary button in Numbers is Start Writing and the secondary button is Choose a Template.

Provide a background that’s clearly distinct from the accessories and title card. You can use a solid color, a gradient, or a pattern. Avoid including complex images or patterns that might distract from foreground elements.

Be mindful of accessory placement. For example, you can place accessories both in front of and behind the title card to create the appearance of depth, but you need to make sure that your app name and both buttons remain clearly visible. Avoid cluttering the title card with too many accessories, and be sure to test its overall appearance across the range of screen sizes and device orientations that you support.

Use animation sparingly. Too much motion on the display can confuse or disorient people. If you want to animate your accessories, consider creating gentle, repeating animations that subtly highlight and enhance your app’s content. For example, you might create an animation that makes an accessory appear to breathe or sway softly. For guidance, see .


##### File provider app extension

If your app can share its files with other apps, you can create a file provider app extension that displays a custom interface for importing, exporting, opening, and moving your app’s documents. For developer guidance, see . An app extension is code you provide that people can install and use to extend the functionality of a specific area of the system; to learn more, see .

When someone uses your file provider extension to open or import documents, display only documents that are appropriate in the current context. For example, if a PDF-editing app loads your extension, only list PDF files for opening or import. You might also want to display additional information, such as modification dates, sizes, and whether documents are local or remote.

Let people select a destination when exporting and moving documents. Unless your app stores documents in a single directory, let people navigate to a specific destination in your directory hierarchy. You could also provide a way to add new subdirectories.

Avoid including a custom top toolbar. Your extension loads within a modal view that already includes a toolbar. Providing a second toolbar is confusing and takes space away from your content.

Your app can also let people browse and open files from other apps. For developer guidance, see .


#### macOS


##### Custom file management

People have strong associations with the familiar file browsing experience of the Finder and most document-based apps. Use the default file browser unless you have an important reason to create a custom one.

Make your custom file-opening interface convenient. For example, people might appreciate an “open recent” action in addition to the simple “open” action. You might also want to let people choose criteria on which to filter the file-browsing experience, or select multiple documents to open at once. In a macOS open panel, you can customize the title of the Open button to reflect the task — for example, if your app lets people insert a file’s contents into the current document, you might change the title to Insert.

Provide a save interface to let people change a file’s name, format, or location. By default, a new document’s title is “Untitled” until people choose a custom name. As with a document-opening interface, a save view can also provide a browsing experience that defaults to a logical location to help people place the saved document where they want. If you support saving content in different formats, also give people a way to choose a specific file format.

Consider extending the functionality of the Save dialog. If it makes sense in your app, you can add a custom accessory view containing useful settings or options to the Save dialog. For example, the dialog for saving Mail messages as files contains an option to include attachments.


##### Finder Sync extensions

If your app syncs local and remote files, you can create a Finder Sync app extension to express file synchronization status and control within the Finder. For developer guidance, see .

For example, you can use a Finder Sync extension to:

- Display badges in the Finder to indicate the sync status of items

- Provide custom contextual menu items that perform file and folder management tasks, like favoriting and adding password-protection

- Provide custom toolbar buttons that perform global actions, like initiating a sync operation

Help people avoid losing work if they turn off autosaving. People can turn off autosaving by selecting the “Ask to keep changes when closing documents” toggle in Desktop & Dock settings. In this scenario, show that a document has unsaved changes and present a save dialog when people choose to close the document, quit your app, log out, or restart.

When autosaving is off, make sure people know when a document has unsaved changes. To show that there are unsaved changes, display a dot on the document window’s close button and next to the document’s name in your app’s Window menu. When autosaving is on, showing a dot in these locations is confusing, because it implies that people need to take action to avoid losing their work. Regardless of autosave status, you can append “Edited” to the document’s title in the title bar, but be sure to remove this suffix as soon as autosave occurs or when people explicitly save their work.


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos


### Change log

---

## Launching

`/design/human-interface-guidelines/launching`

_A streamlined launch experience helps people start using your app or game immediately._

Launching begins when someone opens your app or game, includes an initial download, and ends when the first screen is ready. After launching completes, you might offer an  experience, which can give people a high-level view of your app or game.


### Best practices

Launch instantly. People want to start interacting with your app or game right away, and sometimes they don’t want to wait more than a couple of seconds.

If the platform requires it, provide a launch screen. In iOS, iPadOS, and tvOS, the system displays your launch screen the moment your app or game starts and quickly replaces it with your first screen, giving people the impression that your experience is fast and responsive. For guidance, see . macOS, visionOS, and watchOS don’t require launch screens.

If you need a splash screen, consider displaying it at the beginning of your onboarding flow. A splash screen is a beautiful graphic that succinctly communicates branding and other information you need to provide. If you don’t provide an onboarding experience, you might display your splash screen as soon as launching completes.

Restore the previous state when your app restarts so people can continue where they left off. Avoid making people retrace steps to reach their previous location in your app or game. Restore granular details of the previous state as much as possible. For example, scroll the view to people’s most recent position, and display windows in the same state and location in which people left them.


### Launch screens

Not applicable for macOS, visionOS, or watchOS.

Downplay the launch experience. A launch screen isn’t part of an onboarding experience or a splash screen, and it isn’t an opportunity for artistic expression. A launch screen’s sole function is to enhance the perception of your experience as quick to launch and immediately ready to use.

Design a launch screen that’s nearly identical to the first screen of your app or game. If you include elements that look different when launching completes, people may experience an unpleasant flash between the launch screen and your first screen. If your app or game displays a solid color before transitioning to the first screen, create a launch screen that displays only that solid color. Also make sure that your launch screen matches the device’s current orientation and appearance mode.

Avoid including text on your launch screen, even if your first screen displays text. Because the content in a launch screen doesn’t change, any text you display won’t be localized.

Don’t advertise. The launch screen isn’t a branding opportunity. Avoid creating a screen that looks like a splash screen or an “About” window, and don’t include logos or other branding elements unless they’re a fixed part of your app’s first screen.


### Platform considerations

No additional considerations for macOS or watchOS.


#### iOS, iPadOS

Launch in the appropriate orientation. If your app or game supports both portrait and landscape modes, launch using the device’s current orientation. If your interface only runs in one orientation, launch in that orientation and let people rotate the device if necessary. Ensure a landscape-only interface responds correctly, regardless of whether people enter landscape orientation by rotating the device left or right. For guidance, see .


#### tvOS

> [NOTE] Unlike the  throughout much of a tvOS app, the launch screen is static.

In a live-viewing app, consider automatically starting playback soon after people start the app. People come to your app to watch TV, so you might want to start playing new or recently viewed live content after a few seconds of inactivity. For guidance, see .


#### visionOS

Consider launching in the Shared Space even if your app is fully immersive. Opening a window in the Shared Space lets you provide more context about your app or game while giving it time to load, and it also lets you present a control that people can use to open your fully immersive experience. In general, people appreciate being able to choose when to transition to a Full Space, especially if they’re currently running other apps in the Shared Space. For guidance, see .


### Resources


##### Related


##### Developer documentation

 — Xcode

 — UIKit


##### Videos


### Change log

---

## Loading

`/design/human-interface-guidelines/loading`

_The best content-loading experience finishes before people become aware of it._

If your app or game loads assets, levels, or other content, design the behavior so it doesn’t disrupt or negatively impact the user experience.


### Best practices

Show something as soon as possible. If you make people wait for loading to complete before displaying anything, they can interpret the lack of content as a problem with your app or game. Instead, consider showing placeholder text, graphics, or animations as content loads, replacing these elements as content becomes available.

Let people do other things in your app or game while they wait for content to load. Loading content in the background helps give people access to other actions. For example, a game could load content in the background while players learn about the next level or view an in-game menu. For developer guidance, see .

If loading takes an unavoidably long time, give people something interesting to view while they wait. For example, you might provide gameplay hints, display tips, or introduce people to new features. Gauge the remaining loading time as accurately as possible to help you avoid giving people too little time to enjoy your placeholder content or having so much time that you need to repeat it.

Improve installation and launch time by downloading large assets in the background. Consider using the  framework to schedule asset downloads — like game level packs, 3D character models, and textures — to occur immediately after installation, during updates, or at other nondisruptive times.


### Showing progress

Clearly communicate that content is loading and how long it might take to complete. Ideally, content displays instantly, but for situations where loading takes more than a moment or two, you can use system-provided components — called progress indicators — to show that loading is ongoing. In general, you use a determinate progress indicator when you know how long loading will take, and you use an indeterminate progress indicator when you don’t. For guidance, see .

For games, consider creating a custom loading view. Standard progress indicators work well in most apps, but can sometimes feel out of place in a game. Consider designing a more engaging experience by using custom animations and elements that match the style of your game.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, or visionOS.


#### watchOS

As much as possible, avoid showing a loading indicator in your watchOS experience. People expect quick interactions with their Apple Watch, so aim to display content immediately. In situations where content needs a second or two to load, it’s better to display a loading indicator than a blank screen.


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## Managing accounts

`/design/human-interface-guidelines/managing-accounts`

_When it doesn’t create an unnecessary barrier to your experience, an account can be a convenient way for people to access their content and track personal details._

Ask people to create an account only if your core functionality requires it; otherwise, let people enjoy your app or game without one. If you require an account, consider using  to give people a consistent sign-in experience they can trust and the convenience of not having to remember multiple accounts and authentication methods.


### Best practices

Explain the benefits of creating an account and how to sign up. If your app or game requires an account, write a brief, friendly description of the reasons for the requirement and its benefits. Display this message in your sign-in view.

Delay sign-in for as long as possible. People often abandon apps when they’re forced to sign in before they can do anything useful. To help avoid this situation, give people a chance to get a sense of what your app or game does before asking them to make a commitment to it. For example, a shopping app might let people browse as much as they want, requiring sign-in only when they’re ready to make a purchase.

If you don’t use Sign in with Apple in your iOS, iPadOS, macOS, or visionOS app, prefer using a passkey. Passkeys simplify account creation and authentication, eliminating the need for people to create or enter passwords. When an app supports passkeys, people simply provide their user name when creating a new account or signing in to an existing one. For developer guidance, see . If you need to continue using passwords for authentication, augment security by requiring two-factor authentication (for developer guidance, see ).

Always identify the authentication method you offer. For example, if you display a button for signing in to your app with Face ID, title it using a phrase like “Sign In with Face ID” instead of a generic phrase like “Sign In.”

Refer only to authentication methods that are available in the current context. For example, don’t reference Face ID on a device that doesn’t offer it. Check the device’s capabilities and use the appropriate terminology. For developer guidance, see .

In general, avoid offering an app-specific setting for opting in to biometric authentication. People turn on biometric authentication at the system level, so presenting an in-app setting is redundant and could be confusing.

Avoid using the term passcode to refer to account authentication. People create a passcode to unlock their device or authenticate for Apple services. If you use the term in your interface, people might think you’re asking them to reuse their passcode in your app or game.


### Deleting accounts

If you help people create an account within your app or game, you must also help them delete it, not just deactivate it. In addition to following the guidelines below, be sure to understand and comply with your region’s legal requirements related to account deletion and the right to be forgotten.

> [IMPORTANT] If legal requirements compel your app to maintain accounts or information — such as digital health records — or to follow a specific account-deletion process, clearly describe the situation so people can understand the information or accounts you must maintain and the process you must follow.

Provide a clear way to initiate account deletion within your app or game. If people can’t perform account deletion within your app, you must provide a direct link to the webpage on which people can do so. Make the link easy to discover — for example, don’t bury it in your Privacy Policy or Terms of Service pages.

> [NOTE] If people used  to create an account within your app, you revoke the associated tokens when they delete their account. See .

Provide a consistent account-deletion experience whether people perform it within your app or game or on the website. For example, avoid making one version of the deletion flow longer or more complicated than the other.

Consider letting people schedule account deletion to occur in the future. People can appreciate the opportunity to use their remaining services or wait until their subscription auto-renews before deleting their account. If you offer a way to schedule account deletion, offer an option for immediate deletion as well.

Tell people when account deletion will complete, and notify them when it’s finished. Because it can sometimes take a while to fully delete an account, it’s essential to keep people informed about the status of the deletion process so they know what to expect.

If you support in-app purchases, help people understand how billing and cancellation work when they delete their account. For example, you might need to help people understand the following scenarios:

- Billing for an auto-renewable subscription continues through Apple until people cancel the subscription, regardless of whether they delete their account.

- After they delete their account, people need to cancel their subscription or request a refund.

In addition to helping people understand these scenarios, provide information that describes how to cancel subscriptions and manage purchases. For guidance, see  and .

> [NOTE] Even if people didn’t use your app to purchase the subscription, you still need to support account deletion.


### TV provider accounts

Many popular TV providers let people sign in to their accounts at the system level, eliminating the need to authenticate on an app-by-app basis. If your TV provider app requires people to sign in, use TV Provider Authentication to provide the most efficient onboarding experience.

Avoid displaying a sign-out option when people are signed in at the system level. If your app must include a sign-out option, invoking it needs to prompt people to navigate to Settings > TV Provider to sign out of their account.

Never instruct people to sign out by adjusting privacy controls. The TV provider controls in Settings > Privacy aren’t a sign-out mechanism. These settings help people manage the apps that can access their TV provider account.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, or visionOS.


#### tvOS

Most people interact with Apple TV using a remote, not a keyboard, so ask for the minimum amount of information necessary.

Prefer letting people use another device to sign up or authenticate. When you configure your app’s associated domains, Apple TV can work with other devices to safely suggest sign-in credentials, including . For developer guidance, see .

When people are signed in to a shared account, avoid asking them to choose their profile every time they become the current user. In tvOS 16 and later, your app can share its credentials with all users while storing each individual’s profile and user data separately. When you support this type of sharing, your app can automatically use the current user’s profile without asking each person to sign in separately to a shared account. For developer guidance, see  and .

Minimize data entry. If you need to gather more than a small amount of information, ask people to visit a website from another device. If you need an email address, show the email keyboard screen, which includes a list of recently entered addresses.


#### watchOS

Use iCloud synchronization to provide access to the Keychain, letting people autofill user names and passwords and preserve app settings.


### Resources


##### Related


##### Developer documentation

 — Authentication Services


##### Videos

---

## Managing notifications

`/design/human-interface-guidelines/managing-notifications`

_Notifications can give people timely and important information, whether the device is locked or in use._

You need to get permission before sending any notification. The system lets people change this decision in settings, where they can also silence all notifications (except for government alerts in some locales).


### Integrating with Focus

People appreciate receiving a notification for something they care about, but they don’t always appreciate being interrupted. To help people manage the experience, the system lets them specify delivery times and set up a Focus.

- A Focus helps people filter notifications during a time period they reserve for an activity like sleeping, working, reading, or driving.

- Delivery scheduling lets people choose whether to receive notification alerts immediately or in a summary that’s delivered at times they choose.

People identify the contacts and apps that can break through a Focus to deliver notification alerts. In a Work Focus, for example, people might want to receive alerts from work colleagues, family members, and work-related apps as soon as notifications arrive. People might also want to receive all Time Sensitive notification alerts during a Focus. A Time Sensitive notification contains essential information people appreciate getting right away.

> [IMPORTANT] Even though a Focus might delay the delivery of a notification alert, the notification itself is available as soon as it arrives.

To support these behavior customizations, you first identify the types of notifications your app or game can send. If you support direct communications — like phone calls and messages — you use communication notifications; for all other types of tasks, you use noncommunication notifications. To support communication notifications, you adopt SiriKit intents, which means people can use Siri to customize notification behaviors; for developer guidance, see  and .

You need to specify a system-defined interruption level for each noncommunication notification you send. The system uses the interruption level to help determine when to deliver the alert; when a communication notification arrives, the system uses the sender to determine when to deliver the alert.

The system defines four interruption levels for noncommunication notifications:

- Passive. Information people can view at their leisure, like a restaurant recommendation.

- Active (the default). Information people might appreciate knowing about when it arrives, like a score update on their favorite sports team.

- Time Sensitive. Information that directly impacts the person and requires their immediate attention, like an account security issue or a package delivery.

- Critical. Urgent information about health and safety that directly impacts the person and demands their immediate attention. Critical notifications are extremely rare and typically come from governmental and public agencies or apps that help people manage their health or home.

Notification alerts in each system-defined interruption level can behave in the following ways:

> [NOTE] Because a Critical notification can override the Ring/Silent switch and break through scheduled delivery and Focus, you must get an entitlement to send one.


### Best practices

Build trust by accurately representing the urgency of each notification. People have several ways to adjust how they receive your notifications — including turning off all notifications — so it’s essential to be as realistic as possible when assigning an interruption level. You don’t want people to feel that a notification uses a high level of urgency to interrupt them with low-priority information.

Use the Time Sensitive interruption level only for notifications that are relevant in the moment. To help people understand the benefits of letting Time Sensitive notifications break through a Focus or scheduled delivery, make sure the notification is about an event that’s happening now or will happen within an hour. The first time a Time Sensitive notification arrives from your app, the system describes how such a notification works and gives people a way to turn it off if they don’t agree that the information requires their immediate attention. Going forward, the system periodically gives people additional opportunities to evaluate how your Time Sensitive notification is working for them. For developer guidance, see .


### Sending marketing notifications

Don’t use notifications to send marketing or promotional content unless people explicitly agree to receive such information. When people want to learn about new features, content, or events related to your app or game, they can grant their permission to receive marketing notifications. For example, people who use a subscription app might appreciate getting an offer to become a subscriber, and game players might want to receive a special offer related to a live game event.

Never use the Time Sensitive interruption level to send a marketing notification. People may have agreed to receive marketing notifications from your app, but such a notification must never break through a Focus or scheduled delivery setting.

Get people’s permission if you want to send them promotional or marketing notifications. Before you send these notifications to people, you must receive their explicit permission to do so. Create an alert, modal view, or other interface that describes the types of information you want to send and gives people a clear way to opt in or out.

Make sure people can manage their notification settings within your app. In addition to requesting permission to send informational or marketing notifications, you must also provide an in-app settings screen that lets people change their choice. For guidance, see .


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, or visionOS.


#### watchOS

By default, the notification settings people use for apps on their iPhone apply to the same apps on their Apple Watch. People can manage these settings in the Apple Watch app on iPhone, or they can access per-notification options — such as Mute 1 Hour or Turn off Time Sensitive — by swiping left when a notification arrives on their Apple Watch.


### Resources


##### Related


##### Developer documentation


##### Videos

---

## Modality

`/design/human-interface-guidelines/modality`

_Modality is a design technique that presents content in a separate, dedicated mode that prevents interaction with the parent view and requires an explicit action to dismiss._

Presenting content modally can:

- Ensure that people receive critical information and, if necessary, act on it

- Provide options that let people confirm or modify their most recent action

- Help people perform a distinct, narrowly scoped task without losing track of their previous context

- Give people an immersive experience or help them concentrate on a complex task

Depending on the platform, you might use different components to present these types of modal experiences. For example, all platforms can present an alert, which is a modal view that delivers important information related to your app or game. In addition, each platform may define various types of modal views for presenting context-specific options, such as activity views, sheets, and confirmation dialogs or action sheets. To help people perform a distinct task, iOS, iPadOS, and macOS apps tend to use sheets or popovers, but iPadOS, macOS, and visionOS apps might also just use a separate window.

To provide a temporary experience, like viewing media, or to help people perform a distinct, multistep task, like editing content, apps can offer a full-screen modal experience. In contrast, apps may also offer nonmodal types of full-screen experiences; for guidance, see . visionOS apps can offer a range of immersive experiences; for guidance, see .


### Best practices

Present content modally only when there’s a clear benefit. A modal experience takes people out of their current context and requires an action to dismiss, so it’s important to use modality only when it helps people focus or make choices that affect their content or device.

Aim to keep modal tasks simple, short, and streamlined. If a modal task is too complicated, people can lose track of the task they suspended when they entered the modal view, especially if the modal view obscures their previous context.

Take care to avoid creating a modal experience that feels like an app within your app. In particular, presenting a hierarchy of views within a modal task can make people forget how to retrace their steps. If a modal task must contain subviews, provide a single path through the hierarchy and avoid including buttons that people might mistake for the button that dismisses the modal view.

Consider using a full-screen modal style for in-depth content or a complex task. A modal experience that fills a window or the device display minimizes distractions, so it can work well for presenting videos, photos, or camera views, or to support a multistep task like marking up a document or editing a photo. When a visionOS app runs alongside other apps in the Shared Space, a full-screen modal presentation fills a window; if people transition the app to a Full Space, the full-screen modal presentation can become a more immersive experience.

Always give people an obvious way to dismiss a modal view. In general, it works well to follow the platform conventions people already know. For example, in iOS, iPadOS, and watchOS apps, people typically expect to find a button in the top toolbar or swipe down; in macOS and tvOS apps, people expect to find a button in the main content view.

When necessary, help people avoid data loss by getting confirmation before closing a modal view. Regardless of whether people use a dismiss gesture or a button, if closing the view could result in the loss of user-generated content, be sure to explain the situation and give people ways to resolve it. For example, in iOS, you might present an action sheet that includes a save option.

Make it easy to identify a modal view’s task. When people enter a modal view, they switch away from their previous context and might not return to it right away. When you provide a title that names the modal view’s task — or additional text that describes the task or provides guidance — you can help people keep their place in your app.

Let people dismiss a modal view before presenting another one. Allowing multiple modal views to be visible at the same time tends to create visual clutter and can make your app seem scattered and disorganized. People need to remember the context they were in before a modal view appears, so presenting multiple views adds to people’s cognitive load, especially when a modal view hides another one by appearing on top of it. Although an alert can appear on top of all other content — including other modal views — you never want to display more than one alert at the same time.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Multitasking

`/design/human-interface-guidelines/multitasking`

_Multitasking lets people switch quickly from one app to another, performing tasks in each._

People expect to use multitasking on their devices, and they may think something is wrong if your app doesn’t allow it. With rare exceptions — such as some games, and Apple Vision Pro apps running in a Full Space — every app needs to work well with multitasking.

In addition to app switching, multitasking can present different experiences on different devices; see .


### Best practices

A great multitasking experience helps people accomplish tasks in multiple apps by managing content in a variety of simultaneous contexts. Because you don’t know when people will initiate multitasking, your app or game always needs to be prepared to save and restore their context.

Pause activities that require people’s attention or active participation when they switch away. If your app is a game or a media-viewing app, for example, make sure people don’t miss anything when they switch to another app. When they switch back, let them continue as if they never left.

Respond smoothly to audio interruptions. Occasionally, audio from another app or the system itself may interrupt your app’s audio. For example, an incoming phone call or a music playlist initiated by Siri might interrupt your app’s audio. When situations like these occur, people expect your app to respond in the following ways:

- Pause audio indefinitely for primary audio interruptions, such as playing music, podcasts, or audiobooks.

- Temporarily lower the volume or pause the audio for shorter interruptions, such as GPS directional notifications, and resume the original volume or playback when the interruption ends.

For guidance, see .

Finish user-initiated tasks in the background. When someone starts a task like downloading assets or processing a video file, they expect it to finish even if they switch away from your app. If your app is in the middle of performing a task that doesn’t need additional input, complete it in the background before suspending.

Use notifications sparingly. Your app can send notifications when it’s suspended or running in the background. If people start an important or time-sensitive task in your app, and then switch away from it, they might appreciate receiving a notification when the task completes so they can switch back to your app and take the next step. In contrast, people don’t generally need to know the moment a routine or secondary task completes. In this scenario, avoid sending an unnecessary notification; instead, let people check on the task when they return to your app. For guidance, see .


### Platform considerations

Not supported in watchOS.


#### iOS

On iPhone, multitasking lets people use FaceTime or watch a video in Picture in Picture while they also use a different app.


#### iPadOS

On iPad, people can view and interact with the  of several different apps at the same time. An individual app can also support multiple open windows, which lets people view and interact with more than one window in the same app at one time.

People can use iPad with either full-screen or windowed apps. When full screen, apps occupy the full screen, and people can switch between individual app windows using the app switcher.

When using windowed apps, app windows are resizable, and people can arrange them to suit their needs with behavior similar to macOS. The system provides window controls for common tiling configurations, entering full screen, minimizing, and closing windows. The system identifies the frontmost window by coloring its window controls and casting a drop shadow on windows behind it. For guidance, see .

Additionally, videos and FaceTime calls can also play in a Picture in Picture overlay above other content regardless of whether apps are full screen or windowed.

> [NOTE] Apps don’t control multitasking configurations or receive any indication of the ones that people choose.

To help your app respond correctly when people open it while windowed, make sure it adapts gracefully to different screen sizes. For guidance, see  and ; for developer guidance, see . To learn more about how people use iPad multitasking features, see .


#### macOS

On Mac, multitasking is the default experience because people typically run more than one app at a time, switching between windows and tasks as they work. When multiple app windows are open, macOS applies drop shadows that make the windows appear layered on the desktop, and applies other visual effects to help people distinguish different window states; for guidance, see .


#### tvOS

On Apple TV, people can play or browse content while also playing movies or TV shows in Picture in Picture (where supported).


#### visionOS

On Apple Vision Pro, people can run multiple apps at the same time in the Shared Space, viewing and switching between windows and volumes throughout the space.

Only one window is active at a time in the Shared Space. When people look from one window to another, the window they’re currently looking at becomes active while the previous window becomes more translucent and appears to recede along the z-axis. Closing an app window in the Shared Space transitions the app to the background without quitting it.

> [NOTE] When an app is the Now Playing app, closing its window automatically pauses audio playback; if people want to resume playback, they can do so in Control Center without opening the window.

Avoid interfering with the system-provided multitasking behavior. When people look from one window to another, visionOS applies a feathered mask to the window they look away from to clarify its changed state. To avoid interfering with this visual feedback, don’t change the appearance of a window’s edges.

Don’t pause a window’s video playback when people look away from it. In visionOS, as in macOS, people expect the playback they start in one window to continue while they view or perform a task in another window.

Be prepared for situations where your audio can duck. Unless an app is currently the Now Playing app, its audio can duck when people look away from it to another app.


### Resources


##### Related


##### Developer documentation

 — UIKit

 — UIKit


##### Videos


### Change log

---

## Offering help

`/design/human-interface-guidelines/offering-help`

_Although the most effective experiences are approachable and intuitive, you can provide contextual help when necessary._


### Best practices

Let your app’s tasks inform the types of help people might need. For example, you might help people perform simple, one- or two-step tasks by displaying an inline view that succinctly describes the task. In contrast, if your app or game supports complex or multistep tasks you might want to provide a tutorial that teaches people how to accomplish larger goals. In general, directly relate the help you provide to the precise action or task people are doing right now and make it easy for people to dismiss or avoid the help if they don’t need it.

Use relevant and consistent language and images in your help content. Always make sure guidance is appropriate for the current context. For example, if someone’s using the Siri Remote with your tvOS experience, don’t show tips or images that feature a game controller. Also be sure the terms and descriptions you use are consistent with the platform. For example, don’t write copy that tells people to click a button on an iPhone or tap a menu item on a Mac.

Make sure all help content is inclusive. For guidance, see .

Avoid bloating your help content by explaining how standard components or patterns work. Instead, describe the specific action or task that a standard element performs in your app or game. If your experience introduces a unique control or expects people to use an input device in a nonstandard way — such as holding the Siri Remote rotated 90 degrees — orient people quickly, preferring animation or graphics to educate instead of a lengthy description.


### Creating tips

A tip is a small, transient view that briefly describes how to use a feature in your app. Tips are a great way to teach people about new or less obvious features in your app, or help them discover faster ways to accomplish a task. For developer guidance, see .

Use the most appropriate tip type for your app’s user interface. Display a popover tip when you want to preserve the content flow, or an inline tip when you want to ensure that surrounding information is visible. You can use an annotation-style inline tip when pointing to a specific UI element, or a hint-style tip when it’s not related to a specific piece of UI.

Use tips for simple features. Tips work best on features that are easy to describe and that people can complete with a few simple steps. If a feature requires more than three actions, it’s probably too complicated for a tip.

Make tips short, actionable, and engaging. A tip’s goal is to encourage people to try new features. Use direct, action-oriented language to describe what the feature does and explain how to use it. Keep your tips to one or two sentences and avoid including content that’s promotional or related to a different feature or user flow. Promotional content is anything that advertises, sells, or isn’t aligned with the current context of what the person is doing.

Define rules to help ensure your tips reach the intended audience. Not everyone benefits from every tip. For example, people who’ve already used a feature won’t appreciate viewing a tip that describes it. Use parameter-based or event-based eligibility rules to control when a tip appears, and only display a tip if someone might benefit from its use. When your app has more than one tip, set the display frequency so tips display at a reasonable cadence — for example, once every 24 hours.

If there’s an image or symbol that people associate with the feature, consider including it in the tip, and prefer the filled variant. For example, a tip with a star can help people understand that the tip is related to favorites.

If the feature is represented by an image that the tip connects to directly, avoid repeating the same image in both the tip and the UI.

Use buttons to direct people to information or options. If your feature has settings people can customize, or you want to redirect people to an area where they can learn more about a feature, consider adding a button. Buttons can take people directly to the settings where they make adjustments. Or if there’s more information people might find useful, add a button to take them to additional resources, such as a setup flow.


### Platform considerations

No additional considerations for iOS, iPadOS, tvOS, or watchOS.


#### macOS, visionOS

A tooltip (called a help tag in user documentation) displays a small, transient view that briefly describes how to use a component in the interface. In apps that run on a Mac — including iPhone and iPad apps — tooltips can appear when a person holds the pointer over an element; in visionOS apps, a tooltip can appear when a person looks at an element or holds the pointer over it. For developer guidance, see .

Describe only the control that people indicate interest in. When people want to know how to use a specific control, they don’t want to learn how to use nearby controls or how to perform a larger task.

Explain the action or task the control initiates. It often works well to begin the description with a verb — for example, “Restore default settings” or “Add or remove a language from the list.”

In general, avoid repeating a control’s name in its tooltip. Repeating the name takes up space in the tooltip and rarely adds value to the description.

Be brief. As much as possible, limit tooltip content to a maximum of 60 to 75 characters (note that localization often changes the length of text). To make a description brief and direct, consider using a sentence fragment and omitting articles. If you need a lot of text to describe a control, consider simplifying your interface design.

Use sentence case. Sentence case tends to appear more casual and approachable. If you write complete sentences, omit ending punctuation unless it’s required to be consistent with your app’s style.

Consider offering context-sensitive tooltips. For example, you could provide different text for a control’s different states.


### Resources


##### Related


##### Developer documentation

 — AppKit


##### Videos


### Change log

---

## Onboarding

`/design/human-interface-guidelines/onboarding`

_Onboarding can help people get a quick start using your app or game._

Ideally, people can understand your app or game simply by experiencing it, but if onboarding is necessary, design a flow that’s fast, fun, and optional. When available, onboarding occurs after  is complete — it isn’t part of the launch experience.


### Best practices

Teach through interactivity. People tend to grasp and retain information better when they can actually perform the task they’re learning about instead of just viewing instructional material. As much as possible, provide an interactive onboarding experience where people can safely test an action, discover a feature, or try out a game mechanic.

Consider providing a collection of context-specific tips instead of a single onboarding flow. Integrating contextually relevant tips into your experience can help people learn about their current task while they make progress in your app or game. A context-specific tip can also help people learn better because it lets them concentrate on a single action or task before encountering new information. When you have instructional content that refers to a specific area of the interface, display these instructions near that area. For developer guidance, see .

If you need to present a prerequisite onboarding flow, design a brief, enjoyable experience that doesn’t require people to memorize a lot of information. When onboarding is quick and entertaining, people are more likely to complete it. In contrast, if you try to teach too much, people can feel overwhelmed and may be less likely to remember what they learned.

If it makes sense to offer a separate tutorial, consider making it optional. If you let people skip the tutorial when they first launch your app or game, don’t present it again on subsequent launches, but make sure it’s easy for people to find if they want to view it later. For example, you could make the tutorial available in a help, account, or settings area within your app or game.

Keep onboarding content focused on the experience you provide. People enter your onboarding flow to learn about your app or game; they don’t need to learn how to use the system or the device.


### Additional content

Briefly display a splash screen if necessary. If you need to include a splash screen, design a beautiful graphic that communicates succinctly. Aim to display your splash screen just long enough for people to absorb the information at a glance without feeling that it’s delaying their experience.

Don’t let large downloads hinder onboarding. People want to start using your app or game immediately after first launching it, whether they participate in an onboarding flow or skip it. Consider including enough media and other content in your software package to prevent people from having to wait for downloads to complete before they can start interacting with your app or game. For guidance, see .

Avoid displaying licensing details within your onboarding flow. Let the App Store display agreements and disclaimers so people can read them before downloading your app or game. If you must include these items within the onboarding flow, integrate them in a balanced way that doesn’t disrupt the experience.


### Additional requests

Postpone nonessential setup flows or customization steps. Provide reasonable default settings so most people can immediately start interacting with your app or game without performing additional configuration.

If your app or game needs access to private data or resources before it can function, consider integrating the permission request into your onboarding flow. In this scenario, making the request during your onboarding flow gives you the opportunity to show people why your app or game needs their permission and the benefits of granting it. Otherwise, present a permission request when people first access the specific function that relies on private data or resources. For guidance, see .

Prefer letting people experience your app or game before prompting them for ratings or purchases. People can be more likely to respond positively to such requests when they’ve had a chance to become engaged with your app or game.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Videos


### Change log

---

## Searching

`/design/human-interface-guidelines/searching`

_People use various search techniques to find content on their device, within an app, and within a document or file._

To search for content within an app, people generally expect to use a . When it makes sense, you can personalize the search experience by using what you know about how people interact with your app. For example, you might display recent searches, search suggestions, completions, or corrections based on terms people searched earlier in your app.

In some cases, people appreciate the ability to scope a search or filter the results. For example, people might want to search for items by specifying attributes like creation date, file size, or file type. For guidance, see . You can also help people find content within an open document or file by implementing ways to find content in a window or page in your iOS, iPadOS, or macOS app.

In iOS, iPadOS, and macOS, Spotlight helps people find content across all apps in the system and on the web. When you index and provide information about your app’s content, people can use Spotlight to find content your app contains without opening it first. For guidance, see .


### Best practices

If search is important, give it a primary position in your app or view. For example, in the Notes app, a search field is in the bottom  alongside other important actions. In apps that use , like Photos and Apple TV, search is a dedicated tab.

Aim to make your app’s content searchable through a single location. People appreciate having one clearly identified location they can use to find anything they’re looking for in your app. For apps with clearly distinct sections, it may still be useful to offer a local search. For example, search acts as a filter on the current view when searching your songs and albums in the iOS Music app.

Clearly display the current scope of a search. Use a descriptive placeholder text, a , or a title to help reinforce what someone is currently searching. For example, in the Mail app there is always a clear reference to the mailbox someone is searching.

Provide suggestions to make searching easier. When you display a personʼs recent searches before they start typing or offer predictive search suggestions while they’re typing, you can help people search faster and type less. For developer guidance, see .

Take privacy into consideration before displaying search history. People might not appreciate having their search history appear where others might see it. If you do show search history, provide a way for people to clear it if they want.


### Systemwide search

Make your app’s content searchable in Spotlight. You can share content with Spotlight by making it indexable and specifying descriptive attributes known as metadata. Spotlight extracts, stores, and organizes this information to allow for fast, comprehensive searches.

Define metadata for custom file types you handle. Supply a Spotlight File Importer plug-in that describes the types of metadata your file format contains. For developer guidance, see .

Use Spotlight to offer advanced file-search capabilities within the context of your app. For example, you might include a button that instantly initiates a Spotlight search based on the current selection. You might then display a custom view that presents the search results or a filtered subset of them.

Prefer using the system-provided open and save views. The system-provided open and save views generally include a built-in search field that people can use to search and filter the entire system. For related guidance, see .

Implement a Quick Look generator if your app produces custom file types. A Quick Look generator helps Spotlight and other apps show previews of your documents. For developer guidance, see .


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — Core Spotlight


##### Videos


### Change log

---

## Settings

`/design/human-interface-guidelines/settings`

_People expect apps and games to just work, but they also appreciate having ways to customize the experience to fit their needs._

On all Apple platforms, the system-provided Settings app lets people adjust things like the overall appearance of the system, network connections, account details, accessibility requirements, and language and region settings. On some platforms, the system-provided Settings app can also include settings for specific apps and games, often letting people adjust whether the app or game can access location information, use device features like microphone or camera, and integrate with system features like notifications, Siri, or Search.

When necessary, you can provide a custom settings area within your app or game to offer general settings that affect your overall experience, like interface style or game-saving behavior. If you need to offer settings that affect only a specific task, you can provide these options within the task itself, so people don’t have to leave the experience to customize it.


### Best practices

Aim to provide default settings that give the best experience to the largest number of people. For example, you can automatically maximize performance for the device your game is running on instead of asking players to make this choice after your game launches (for developer guidance, see ). When you choose appropriate default settings, people may not have to make any adjustments before they can start enjoying your app or game.

Minimize the number of settings you offer. Although people appreciate having control over an app or game, too many settings can make the experience feel less approachable, while also making it hard to find a particular setting.

Make settings available in ways people expect. For example, when a physical keyboard is connected, people often use the standard Command-Comma (,) keyboard shortcut to open an app’s settings, whereas in a game, players often use the Esc (Escape) key.

Avoid using settings to ask for setup information you can get in other ways. For example, a game can automatically detect a connected controller or accessory instead of asking the player to identify it; an app can detect whether people are currently using Dark Mode.

Respect people’s systemwide settings and avoid including redundant versions of them in your custom settings area. People expect to use the system-provided Settings app to manage global options like accessibility accommodations, scrolling behavior, and authentication methods, and they expect all apps and games to adhere to their choices. Including custom versions of global options in your settings area is likely to confuse people because it implies that systemwide settings may not apply to your app or game and that changing your custom version of a global setting may affect other apps and games, too.


### General settings

Put general, infrequently changed settings in your custom settings area. People must suspend what they’re doing to open an app’s or game’s settings area, so you want to include options that people don’t need to change all the time. For example, an app might list options for adjusting window configuration; a game might let players specify game-saving behavior or keyboard mappings; both apps and games might offer options related to people’s accounts.


### Task-specific options

When possible, prefer letting people modify task-specific options without going to your settings area. For example, if people can adjust things like showing or hiding parts of the current view, reordering a collection of items, or filtering a list, make these options available in the screens they affect, where they’re discoverable and convenient. Putting this type of option in a separate settings area disconnects it from its context, requiring people to suspend their task to make adjustments, and often hiding the results until people resume the task.

> [NOTE] In games, players tend to adjust their approach to a specific task as part of the gameplay, not as a settings option to change.


### System settings

Add only the most rarely changed options to the system-provided Settings app. If it makes sense to add your app’s or game’s settings to the system-provided Settings app, consider providing a button that opens it directly from your interface.


### Platform considerations

No additional considerations for iOS, iPadOS, tvOS, or visionOS.


#### macOS

When people choose the Settings item in your app’s or game’s App menu, your custom settings window opens. Typically, a custom settings window contains a toolbar that includes buttons for switching between views — called panes — that each contain a group of related settings.

Include a settings item in the . Avoid adding settings buttons to a window’s toolbar, because doing so decreases the space available for essential commands that people use frequently. If you provide document-level options, add this item to your app’s .

Dim a settings window’s minimize and maximize buttons. It’s quick to open a custom settings window using the standard Command–Comma (,) keyboard command, so there’s no need to keep the window in the Dock, and because a settings window accommodates the size of the current pane, people don’t need to expand the window to see more.

In your settings window, use a noncustomizable toolbar that remains visible and always indicates the active toolbar button. A settings window’s toolbar identifies the areas people can customize and helps people navigate among those areas. People rely on a stable settings interface to help them find what they need.

Update the window’s title to reflect the currently visible pane. If your settings window doesn’t have multiple panes, use the title App Name Settings.

Restore the most recently viewed pane. People often adjust related settings more than once, so it can be convenient when a settings window opens to the last pane people used.


#### watchOS

In watchOS, apps and games don’t add custom settings to the system-provided Settings app. As an alternative, consider making a small number of essential options available at the bottom of the main view or letting people use a More menu to reconfigure objects.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — Foundation


### Change log

---

## Undo and redo

`/design/human-interface-guidelines/undo-and-redo`

_Undo and redo gives people easy ways to reverse many types of actions, which can also help people explore and experiment safely as they learn a new interface or task._

People expect undo and redo to let them reverse their recent actions, so they’re likely to try undoing — often multiple times — until something changes. In a situation like this, people might not remember which of their previous actions an undo is targeting, which can lead to unintended changes and frustration. To help people remain in control, it’s essential to help people predict the outcome of undoing and redoing and to highlight the results.


### Best practices

Help people predict the results of undo and redo as much as possible. On iPhone, for example, you can describe the result in the alert that displays when people shake the device, giving them the option of performing the undo or canceling it. If you provide undo and redo menu items, you can modify the menu item labels to identify the result. For example, a document-based app might use menu item labels like Undo Typing or Redo Bold.

Show the results of an undo or redo. Sometimes, the most recent action that people want to undo affects content or an area that’s no longer visible. In cases like this, it’s crucial to highlight the result of each undo and redo to keep people from thinking that the action had no effect, which can lead them to perform it repeatedly. For example, if people undo after deleting a paragraph in a document area that’s no longer onscreen, you might scroll the document to show the restored paragraph.

Let people undo multiple times. Avoid placing unnecessary limits on the number of times people can undo or redo. People generally expect to undo every action they’ve performed since taking a logical step like opening a document or saving their work.

Consider giving people the option to revert multiple changes at once. In some scenarios, people might appreciate the ability to undo a batch of discrete but related actions — like incremental adjustments to a single property or attribute — so they don’t have to undo each individual adjustment. In other cases, it can make sense to give people a convenient way to undo all the changes they made since opening a document or saving their work.

Provide undo and redo buttons only when necessary. People generally expect to initiate undo and redo in system-supported ways, such as choosing the items in a macOS app’s Edit menu, using keyboard shortcuts on a Mac or iPad, or shaking their iPhone. If it’s important to provide dedicated undo and redo buttons in your app, use the standard system-provided symbols and put the buttons in a toolbar.


### Platform considerations

No additional considerations for visionOS. Not supported in tvOS or watchOS.


#### iOS, iPadOS

Avoid redefining standard gestures for undo and redo. For example, people can use a three-finger swipe to initiate an undo or redo, or shake their iPhone. As with all standard gestures, redefining them in your interface runs the risk of confusing people and making your experience unpredictable.

Briefly and precisely describe the operation to be undone or redone. The undo and redo alert title automatically includes a prefix of “Undo ” or “Redo ” (including the trailing space). You need to provide an additional word or two that describes what’s being undone or redone, to appear after this prefix. For example, you might create alert titles such as “Undo Name” or “Redo Address Change.”


#### macOS

Place undo and redo commands in the Edit menu and support the standard keyboard shortcuts. Mac users expect to find undo and redo at the top of the Edit menu; they also expect to use Command–Z and Shift–Command–Z to perform undo and redo, respectively.


### Resources


##### Related


##### Developer documentation

 — Foundation


##### Videos

---

## Content

`/design/human-interface-guidelines/content`

---

## Layout and organization

`/design/human-interface-guidelines/layout-and-organization`

---

## Menus and actions

`/design/human-interface-guidelines/menus-and-actions`

---

## Navigation and search

`/design/human-interface-guidelines/navigation-and-search`

---

## Presentation

`/design/human-interface-guidelines/presentation`

---

## Selection and input

`/design/human-interface-guidelines/selection-and-input`

---

## Status

`/design/human-interface-guidelines/status`

---

## System experiences

`/design/human-interface-guidelines/system-experiences`

---

## Focus and selection

`/design/human-interface-guidelines/focus-and-selection`

_Focus helps people visually confirm the object that their interaction targets._

Focus supports simplified, component-based navigation. Using inputs like a remote, game controller, or keyboard, people bring focus to the components they want to interact with.

In many cases, focusing an item also selects it. The exception is when automatic selection might cause a distracting context shift, like opening a new view. In tvOS, for example, people use the remote to move focus from item to item as they seek the one they want, but because selecting a focused item opens or activates it, selection requires a separate gesture.

Different platforms communicate focus in different ways. For example, iPadOS and macOS show focus by drawing a ring around an item or highlighting it; tvOS generally uses the  to give the focused item an appearance of depth and liveliness. The combination of focus effects and interactions is sometimes called a focus system or focus model.


### Best practices

Rely on system-provided focus effects. System-defined focus effects are precisely tuned to complement interactions with Apple devices, providing experiences that feel responsive, fluid, and lifelike. Incorporating system-provided focus behaviors gives your app consistency and predictability, helping people understand it quickly. Consider creating custom focus effects only if it’s absolutely necessary.

Avoid changing focus without people’s interaction. People rely on the focus system to help them know where they are in your app. If you change focus without their interaction, people have to spend time finding the newly focused item, delaying their current task. The exception is when people are moving focus using an input device that lets them make discrete, directional movements — like a keyboard, remote, or game controller — and a previously focused item disappears. In this scenario, there are only a small number of items within one discrete step of the previously focused item, so moving focus to one of these remaining items ensures that the focus indicator is in a location people can easily find. When people aren’t moving focus by using such an input device, you can’t predict the item they’ll target next, so it’s generally best to simply hide the focus indicator when the focused object disappears.

Be consistent with the platform as you help people bring focus to items in your app. For example, in iPadOS and macOS, a full keyboard access mode helps people use the keyboard to reach every control, so you only need to support focus for content elements like list items, text fields, and search fields, and not for controls like buttons, sliders, and toggles. In contrast, tvOS users rely on using directional gestures on a remote or game controller (or pressing the arrow keys on an attached keyboard) to reach every onscreen element, so you need to make sure that people can bring focus to every element in your app.

Indicate focus using visual appearances that are consistent with the platform. For example, consider a window that contains a list of items. In iPadOS and macOS, the system draws focused list items using white text and a background highlight that matches the app’s accent color, drawing unfocused items using the standard text color and a gray background highlight (for developer guidance, see  and ).

In general, use a focus ring for a text or search field, but use a highlight in a list or collection. Although you can use a focus ring to draw attention to an item that fills a cell, like a photo, it’s usually easier for people to view lists and collections when an entire row is highlighted.


### Platform considerations

Not supported in iOS or watchOS.


#### iPadOS

iPadOS 15 and later defines a focus system that supports keyboard interactions for navigating text fields, text views, and sidebars, in addition to various types of collection views and other custom views in your app.

The iPadOS and tvOS focus systems are similar. People perform actions by moving a focus indicator to an item and then selecting it (for guidance, see ). Although the underlying system is the same, the user experiences are a little different. tvOS uses directional focus, which means people can use the same interaction — that is, swiping the Siri Remote or using only the arrow keys on a connected keyboard — to navigate to every onscreen component. In contrast, iPadOS defines focus groups, which represent specific areas within an app, like a sidebar, grid, or list. Using focus groups, iPadOS can support two different keyboard interactions.

- Pressing the Tab key moves focus among focus groups, letting people navigate to sidebars, grids, and other app areas.

- Pressing an arrow key supports a directional focus interaction that’s similar to tvOS, but limited to navigation among items in the same focus group. For example, people can use an arrow key to move through the items in a list or a sidebar.

Onscreen components can indicate focus by using the halo effect or the highlighted appearance.

The halo focus effect — also known as the focus ring — displays a customizable outline around the component. You can apply the halo effect to custom views and to fully opaque content within a collection or list cell, such as an image.

Customize the halo focus effect when necessary. By default, the system uses an item’s shape to infer the shape of its halo. If the system-provided halo doesn’t give you the appearance you want, you can refine it to match contours like rounded corners or shapes defined by Bézier paths. You can also adjust a halo’s position if another component occludes or clips it. For example, you might need to ensure that a badge appears above the halo or that a parent view doesn’t clip it. For developer guidance, see .

The highlighted appearance — in which the component’s text uses the app’s accent color — also indicates focus, but it’s not a focus effect. The highlight appearance occurs automatically when people select a collection view cell on which you’ve set content configurations (for developer guidance, see ).

Ensure that focus moves through your custom views in ways that make sense. As people continue pressing the Tab key, focus moves through focus groups in reading order: leading to trailing, and top to bottom. Although focus moves through system-provided views in ways that people expect, you might need to adjust the order in which the focus system visits your custom views. For example, if you want focus to move down through a vertical stack of custom views before it moves in the trailing direction to the next view, you need to identify the stack container as a single focus group. For developer guidance, see .

Adjust the priority of an item to reflect its importance within a focus group. When a group receives focus, its primary item automatically receives focus too, making it easy for people to select the item they’re most likely to want. You can make an item primary by increasing its priority. For developer guidance, see .


#### tvOS

In a full-screen experience, let people use gestures to interact with the content, not to move focus. When an item displays in full screen, it doesn’t show focus, so people naturally assume that their gestures will affect the object, and not its focus state.

Avoid displaying a pointer. People expect to navigate a fixed number of items by changing focus, not by trying to drag a tiny pointer around a huge screen. While free-form movement might make sense during gameplay, such as when looking for a hidden object or flying a plane, use the focus model when people navigate menus and other interface elements. If your app requires a pointer, make sure it’s highly visible and feels integrated with your experience.

Design your interface to accommodate components in various focus states. In tvOS, focusable items can have up to five different states, each of which is visually distinct. Because focusing an item often increases its scale, you need to supply assets for the larger, focused size to ensure they always look sharp, and you need to make sure the larger item doesn’t crowd the surrounding interface.

For developer guidance, see .


#### visionOS

visionOS supports the same focus system as in iPadOS and tvOS, letting people use a connected input device like a keyboard or game controller to interact with apps and the system.

> [NOTE] When people look at a virtual object to identify it as the object they want to interact with, the system uses the hover effect, not a focus effect, to provide visual feedback (for guidance, see ). The hover effect isn’t related to the focus system.


### Resources


##### Related


##### Developer documentation

 — TVML

 — UIKit

 — UIKit


##### Videos


### Change log

---

## Gestures

`/design/human-interface-guidelines/gestures`

_A gesture is a physical motion that a person uses to directly affect an object in an app or game on their device._

Depending on the device they’re using, people can make gestures on a touchscreen, in the air, or on a range of input devices such as a trackpad, mouse, remote, or game controller that includes a touch surface.

Every platform supports basic gestures like tap, swipe, and drag. Although the precise movements that make up basic gestures can vary per platform and input device, people are familiar with the underlying functionality of these gestures and expect to use them everywhere. For a list of these gestures, see .


### Best practices

Give people more than one way to interact with your app. People commonly prefer or need to use other inputs — such as their voice, keyboard, or Switch Control — to interact with their devices. Don’t assume that people can use a specific gesture to perform a given task. For guidance, see .

In general, respond to gestures in ways that are consistent with people’s expectations. People expect most gestures to work the same regardless of their current context. For example, people expect tap to activate or select an object. Avoid using a familiar gesture like tap or swipe to perform an action that’s unique to your app; similarly, avoid creating a unique gesture to perform a standard action like activating a button or scrolling a long view.

Handle gestures as responsively as possible. Useful gestures enhance the experience of direct manipulation and provide immediate feedback. As people perform a gesture in your app, provide feedback that helps them predict its results and, if necessary, communicates the extent and type of movement required to complete the action.

Indicate when a gesture isn’t available. If you don’t clearly communicate why a gesture doesn’t work, people might think your app has frozen or they aren’t performing the gesture correctly, leading to frustration. For example, if someone tries to drag a locked object, the UI may not indicate that the object’s position has been locked; or if they try to activate an unavailable button, the button’s unavailable state may not be clearly distinct from its available state.


### Custom gestures

Add custom gestures only when necessary. Custom gestures work best when you design them for specialized tasks that people perform frequently and that aren’t covered by existing gestures, like in a game or drawing app. If you decide to implement a custom gesture, make sure it’s:

- Discoverable

- Straightforward to perform

- Distinct from other gestures

- Not the only way to perform an important action in your app or game

Make custom gestures easy to learn. Offer moments in your app to help people quickly learn and perform custom gestures, and make sure to test your interactions in real use scenarios. If you’re finding it difficult to use simple language and graphics to describe a gesture, it may mean people will find the gesture difficult to learn and perform.

Use shortcut gestures to supplement standard gestures, not replace them. While you may supply a custom gesture to quickly access parts of your app, people also need simple, familiar ways to navigate and perform actions, even if it means an extra tap or two. For example, in an app that supports navigation through a hierarchy of views, people expect to find a Back button in a top toolbar that lets them return to the previous view with a single tap. To help accelerate this action, many apps also offer a shortcut gesture — such as swiping from the side of a window or touchscreen — while continuing to provide the Back button.

Avoid conflicting with gestures that access system UI. Several platforms offer gestures for accessing system behaviors, like edge swiping in watchOS or rolling your hand over to access system overlays in visionOS. It’s important to avoid defining custom gestures that might conflict with these interactions, as people expect these controls to work consistently. In specific circumstances within games or immersive experiences, developers can work around this area by deferring the system gesture. For more information, see the platform considerations for iOS, iPadOS, watchOS, and visionOS.


### Platform considerations


#### iOS, iPadOS

In addition to the  supported in all platforms, iOS and iPadOS support a few other gestures that people expect.

Consider allowing simultaneous recognition of multiple gestures if it enhances the experience. Although simultaneous gestures are unlikely to be useful in nongame apps, a game might include multiple onscreen controls — such as a joystick and firing buttons — that people can operate at the same time. For guidance on integrating touchscreen input with Apple Pencil input in your iPadOS app, see .


#### macOS

People primarily interact with macOS using a  and mouse. In addition, they can make  on a Magic Trackpad, Magic Mouse, or a  that includes a touch surface.


#### tvOS

People expect to use  to navigate tvOS apps and games with a compatible remote, Siri Remote, or  that includes a touch surface. For guidance, see .


#### visionOS

visionOS supports two categories of gestures: indirect and direct.

People use an indirect gesture by looking at an object to target it, and then manipulating that object from a distance — indirectly — with their hands. For example, a person can look at a button to focus it and select it by quickly tapping their finger and thumb together. Indirect gestures are comfortable to perform at any distance, and let people quickly change focus between different objects and select items with minimal movement.

People use a direct gesture to physically touch an interactive object. For example, people can directly type on the visionOS keyboard by tapping the virtual keys. Direct gestures work best when they are within reach. Because people may find it tiring to keep their arms raised for extended periods, direct gestures are best for infrequent use. visionOS also supports direct versions of all standard gestures, allowing people the choice to interact directly or indirectly with any standard component.

Here are the standard direct gestures people use in visionOS; see  for a list of standard indirect gestures.

Support standard gestures everywhere you can. For example, as soon as someone looks at an object in your app or game, tap is the first gesture they’re likely to make when they want to select or activate it. Even if you also support custom gestures, supporting standard gestures such as tap helps people get comfortable with your app or game quickly.

Offer both indirect and direct interactions when possible. Prefer indirect gestures for UI and common components like buttons. Reserve direct gestures and custom gestures for objects that invite close-up interaction or specific motions in a game or interactive experience.

Avoid requiring specific body movements or positions for input. Not all people can perform specific body movements or position themselves in certain ways at all times, whether due to disability, spatial constraints, or other environmental factors. If your experience requires movement, consider supporting alternative inputs to let people choose the interaction method that works best for them.


##### Designing custom gestures in visionOS

If you want to offer a specific interaction for your experience that people can’t perform using an existing system gesture, consider designing a custom gesture. To offer this type of interaction, your app needs to be running in a Full Space, and you must request people’s permission to access information about their hands. For developer guidance, see .

Prioritize comfort. Continually test ergonomics of all interactions that require custom gestures. A custom interaction that requires people to keep their arms raised for even a little while can be physically tiring, and repeating very similar movements many times in succession can stress people’s muscles and joints.

Carefully consider complex custom gestures that involve multiple fingers or both hands. People may not always have both hands available when using your app or game. If you require a more complex gesture for your experience, consider also offering an alternative that requires less movement.

Avoid custom gestures that require using a specific hand. It can increase someone’s cognitive load if they need to remember which hand to use to trigger a custom gesture. It may also make your experience less welcoming to people with strong hand-dominance or limb differences.


##### Working with system overlays in visionOS

In visionOS 2 and later, people can look at the palm of one hand and use gestures to quickly access system overlays for Home and Control Center. These interactions are available systemwide, and are reserved solely for accessing system overlays.

> [NOTE] The system overlay is the default method of accessing Control Center in visionOS 2 and later. The visionOS 1 behavior (looking upward) remains available as an accessibility setting.

When designing apps and games that use custom gestures or anchor content to a person’s hands, it’s important to take interactions with the system overlays into consideration.

Reserve the area around a person’s hand for system overlays and their related gestures. If possible, don’t anchor content to a person’s hands or wrists. If you’re designing a game that involves hand-anchored content, place it outside of the immediate area of someone’s hand to avoid colliding with the Home indicator.

Consider deferring the system overlay behavior when designing an immersive app or game. In certain circumstances, you may not want the Home indicator to appear when someone looks at the palm of their hand. For example, a game that uses virtual hands or gloves may want to keep someone within the world of the story, even if they happen to look at their hands from different angles. In such cases, when your app is running in a Full Space, you can choose to require a tap to reveal the Home indicator instead. For developer guidance, see .

> [NOTE] Apps and games that you built for visionOS 1 defer the system overlay behavior by default. When a person looks at their palm with your app running in a Full Space, the Home indicator won’t appear unless they tap first.

Use caution when designing custom gestures that involve a rolling motion of the hand, wrist, and forearm. This specific motion is reserved for revealing system overlays. Since system overlays always display on top of app content and your app isn’t aware of when they’re visible, it’s important to test any custom gestures or content that might conflict.


#### watchOS


##### Double tap

In watchOS 11 and later, people can use the double-tap gesture to scroll through lists and scroll views, and to advance between vertical tab views. Additionally, you can specify a toggle or button as the primary action in your app, or in your widget or Live Activity when the system displays it in the Smart Stack. Double-tapping in a view with a primary action highlights the control and then performs the action. The system also supports double tap for custom actions that you offer in , where it acts on the first nondestructive action in the notification.

Avoid setting a primary action in views with lists, scroll views, or vertical tabs. This conflicts with the default navigation behaviors that people expect when they double-tap.

Choose the button that people use most commonly as the primary action in a view. Double tap is helpful in a nonscrolling view when it performs the action that people use the most. For example, in a media controls view, you could assign the primary action to the play/pause button. For developer guidance, see  and .


### Specifications


#### Standard gestures

The system provides APIs that support the familiar gestures people use with their devices, whether they use a touchscreen, an indirect gesture in visionOS, or an input device like a trackpad, mouse, remote, or game controller. For developer guidance, see .

For guidance on supporting additional gestures and button presses on specific input devices, see , , and .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit


##### Videos


### Change log

---

## Keyboards

`/design/human-interface-guidelines/keyboards`

_A physical keyboard can be an essential input device for entering text, playing games, controlling apps, and more._

People can connect a physical keyboard to any device except Apple Watch. Mac users tend to use a physical keyboard all the time and iPad users often do. Many games work well with a physical keyboard, and people can prefer using one instead of a  when entering a lot of text.

Keyboard users often appreciate using keyboard shortcuts to speed up their interactions with apps and games. A keyboard shortcut is a combination of a primary key and one or more modifier keys (Control, Option, Shift, and Command) that map to a specific command. A keyboard shortcut in a game — called a key binding — often consists of a single key.

Apple defines standard keyboard shortcuts to work consistently across the system and most apps, helping people transfer their knowledge to new experiences. Some apps define custom keyboard shortcuts for the app-specific commands people use most; most games define custom key bindings that make it quick and efficient to use the keyboard to control the game. For guidance, see .


### Best practices

Support Full Keyboard Access when possible. Available in iOS, iPadOS, macOS, and visionOS, Full Keyboard Access lets people navigate and activate windows, menus, controls, and system features using only the keyboard. To test Full Keyboard Access in your app or game, turn it on in the Accessibility area of the system-supplied Settings app. For developer guidance, see  and .

> [IMPORTANT] Although iPadOS supports keyboard navigation in text fields, text views, and sidebars, and provides APIs you can use to support it in collection views and other custom views, avoid supporting keyboard navigation for controls, such as buttons, segmented controls, and switches. Instead, let people use Full Keyboard Access to activate controls, navigate to all onscreen components, and perform gesture-based interactions like drag and drop. For guidance, see ; for developer guidance, see .

Respect standard keyboard shortcuts. While using most apps, people generally expect to rely on the standard keyboard shortcuts that work in other apps and throughout the system. If your app offers a unique action that people perform frequently, prefer creating a  shortcut for it instead of repurposing a standard one that people associate with a different action. While playing a game, people may expect to use certain standard keyboard shortcuts — such as Command–Q to quit the game — but they also expect to be able to modify each game’s key bindings to fit their personal play style. For guidance, see .


### Standard keyboard shortcuts

In general, don’t repurpose standard keyboard shortcuts for custom actions. People can get confused when the shortcuts they know work differently in your app or game. Only consider redefining a standard shortcut if its action doesn’t make sense in your experience. For example, if your app doesn’t support text editing, it doesn’t need a text-styling command like Italic, so you might repurpose Command–I for an action that has more relevance, like Get Info.

People expect each of the following standard keyboard shortcuts to perform the action listed in the table below.

The system also defines several keyboard shortcuts for use with localized versions of the system, localized keyboards, keyboard layouts, and input methods. These shortcuts don’t correspond directly to menu commands.


### Custom keyboard shortcuts

Define custom keyboard shortcuts for only the most frequently used app-specific commands. People appreciate using keyboard shortcuts for actions they perform frequently, but defining too many new shortcuts can make your app seem difficult to learn.

Use modifier keys in ways that people expect. For example, pressing Command while dragging moves items as a group, and pressing Shift while drag-resizing constrains resizing to the item’s aspect ratio. In addition, holding an arrow key moves the selected item by the smallest app-defined unit of distance until people release the key.

Here are the modifier keys and the symbols that represent them.

> [TIP] Some languages require modifier keys to generate certain characters. For example, on a French keyboard, Option-5 generates the “{“ character. It’s usually safe to use the Command key as a modifier, but avoid using an additional modifier with characters that aren’t available on all keyboards. If you must use a modifier other than Command, prefer using it only with the alphabetic characters.

List modifier keys in the correct order. If you use more than one modifier key in a custom shortcut, always list them in this order: Control, Option, Shift, Command.

Avoid adding Shift to a shortcut that uses the upper character of a two-character key. People already understand that they must hold the Shift key to type the upper character of a two-character key, so it’s clearer to simply list the upper character in the shortcut. For example, the keyboard shortcut for Hide Status Bar is Command-Slash, whereas the keyboard shortcut for Help is Command-Question mark, not Shift-Command-Slash.

Let the system localize and mirror your keyboard shortcuts as needed. The system automatically localizes a shortcut’s primary and modifier keys to support the currently connected keyboard; if your app or game switches to a right-to-left layout, the system automatically mirrors the shortcut. For guidance, see .

Avoid creating a new shortcut by adding a modifier to an existing shortcut for an unrelated command. For example, because people are accustomed to using Command-Z for undoing an action, it would be confusing to use Shift-Command-Z as the shortcut for a command that’s unrelated to undo and redo.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, or tvOS. Not supported in watchOS.


#### visionOS

In visionOS, an app’s keyboard shortcuts appear in the shortcut interface that displays when people hold the Command key on a connected keyboard. Similar in organization to an app’s  on iPad or Mac, the shortcut interface on Apple Vision Pro displays app commands in familiar system-defined menu categories such as File, Edit, and View. Unlike menu bar menus, the shortcut interface displays all relevant categories in one view, listing within each category only available commands that also have shortcuts.

Write descriptive shortcut titles. Because the shortcut interface displays a flat list of all items in each category, submenu titles aren’t available to provide context for their child items. Make sure each shortcut title is descriptive enough to convey its action without the additional context a submenu title might provide. For developer guidance, see .

Recognize that people see an overlay when they use a physical keyboard with your visionOS app or game. When people connect a physical keyboard while using your visionOS app or game, the system displays a virtual keyboard overlay that provides typing completion and other controls.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Pointing devices

`/design/human-interface-guidelines/pointing-devices`

_People can use a pointing device like a trackpad or mouse to navigate the interface and initiate actions._

People appreciate the precision and flexibility that pointing devices offer. On a Mac, people typically expect to combine a pointing device with a keyboard as they navigate apps and the system. On iPad and Apple Vision Pro, a pointing device gives people an additional way to interact with apps and content, without replacing touch, eyes, or gestures.


### Best practices

Be consistent when responding to mouse and trackpad gestures. People expect most gestures to work the same throughout the system, regardless of the app or game they’re using. On a Mac, for example, people rely on the “Swipe between pages” gesture to behave the same way whether they’re browsing individual document pages, webpages, or images.

Avoid redefining systemwide trackpad gestures. Even in a game that uses app-specific gestures in a custom way, people expect systemwide gestures to be available; for example, people expect to make familiar gestures to reveal the Dock or Mission Control in macOS. Remember that Mac users can customize the gestures for performing systemwide actions.

Provide a consistent experience in your app, whether people are using gestures, eyes, a pointing device, or a keyboard. People expect to move fluidly between multiple types of input, and they don’t want to learn different interactions for each mode or for each app they use.

Let people use the pointer to reveal and hide controls that automatically minimize or fade out. In iPadOS, for example, people can reveal the minimized Safari toolbar by holding the pointer over it (the toolbar minimizes again when the pointer moves away). People can also move the pointer to reveal or hide playback controls while they watch a full-screen video.

Provide a consistent experience when people press and hold a modifier key while interacting with objects in your app. For example, if people can duplicate an object by pressing and holding the Option key while they drag that object, ensure the result is the same whether they drag using touch or the pointer.


### Platform considerations

No additional considerations for iOS. Not supported in tvOS or watchOS.


#### iPadOS

iPadOS builds on the traditional pointer experience, automatically adapting the pointer to the current context and providing rich visual feedback at a level of precision that enhances productivity and simplifies common tasks on a touchscreen device. The iPadOS pointing system gives people an additional way to interact with apps and content — it doesn’t replace touch.

Allow multiple selection in custom views when necessary. In iPadOS 15 and later, people can click and drag the pointer over multiple items to select them. As people use the pointer in this way, it expands into a visible rectangle that selects the items it encompasses. Standard nonlist collection views support this interaction by default; if you want to support multiple selection in custom views, you need to implement it yourself. For developer guidance, see .

Distinguish between pointer and finger input only if it provides value. For example, a scrubber can give people an additional way to target a location in a video when they’re using the pointer. In this scenario, people can drag the playhead using either the pointer or touch, but they can use the pointer to click a precise seek destination.


##### Pointer shape and content effects

iPadOS integrates the appearance and behavior of both the pointer and the element it moves over, bringing focus to the item the pointer is targeting. You can support the system-provided pointer effects or modify them to suit your experience.

By default, the pointer’s shape is a circle, but it can display a system-defined or custom shape when people move it over specific elements or regions. For example, the pointer automatically uses the familiar I-beam shape when people move it over a text-entry area.

With a content effect, the UI element or region beneath the pointer can also change its appearance when people hold the pointer over it. Depending on the type of content effect, the pointer can retain its current shape or transform into a shape that integrates with the element’s new appearance.

iPadOS defines three content effects that bring focus to different types of interactive elements in your app: highlight, lift, and hover.

The highlight effect transforms the pointer into a translucent, rounded rectangle that acts as a background for a control and includes a gentle parallax. The subtle highlighting and movement bring focus to the control without distracting people from their task. By default, iPadOS applies the highlight effect to bar buttons, tab bars, segmented controls, and edit menus.

The lift effect combines a subtle parallax with the appearance of elevation to make an element seem like it’s floating above the screen. As the pointer fades out beneath the element, iPadOS creates the illusion of lift by scaling the element up while adding a shadow below it and a soft specular highlight on top of it. By default, iPadOS applies the lift effect to app icons and to buttons in Control Center.

Hover is a generic effect that lets you apply custom scale, tint, or shadow values to an element as the pointer moves over it. The hover effect combines your custom values to bring focus to an item, but it doesn’t transform the default pointer shape.


##### Pointer accessories

Pointer accessories are visual indicators that help people understand how they can use the pointer to interact with the current UI element. For example, a pointer approaching a resizable element might display small arrows to indicate that the element allows resizing along a certain axis.

Unlike pointer shapes and content effects, accessories are secondary items that can combine with any pointer to communicate additional information. For developer guidance, see .

Use clear, simple images to create custom accessories. A pointer accessory is small, so it’s essential to create an image that communicates the pointer interaction without using too many details.

Consider using the accessory transition to signal a change in an element’s state or behavior. In addition to animating the appearance and disappearance of pointer accessories, the system also animates the transitions among accessory shapes and positions that can accompany content effects. For example, you could communicate that an add action has become unavailable by transitioning the pointer accessory from the `plus` symbol to the `circle.slash` symbol.


##### Pointer magnetism

iPadOS helps people use the pointer to target an element by making the element appear to attract the pointer. People can experience this magnetic effect when they move the pointer close to an element and when they flick the pointer toward an element.

When people move the pointer close to an element, the system starts transforming the pointer’s shape as soon as it reaches the element’s hit region. Because an element’s hit region typically extends beyond its visible boundaries, the pointer begins to transform before it appears to touch the element itself, creating the illusion that the element is pulling the pointer toward it.

When people flick the pointer toward an element, iPadOS examines the pointer’s trajectory to discover the element that’s the most likely target. When there’s an element in the pointer’s path, the system uses magnetism to pull the pointer toward the element’s center.

By default, iPadOS applies magnetism to elements that use the lift effect (like app icons) and the highlight effect (like bar buttons), but not to elements that use hover. Because an element that supports hover doesn’t transform the default pointer shape, adding magnetism could be jarring and might make people feel that they’ve lost control of the pointer.

The system also applies magnetism to text-entry areas, where it can help people avoid skipping to another line if they make unintended vertical movements while they’re selecting text.


##### Standard pointers and effects

When possible, support the system-provided content effects. People quickly become accustomed to the content effects they see throughout the system and generally expect their experience to apply to every app they use. To provide a consistent user experience, align your interactions with the design intent of each effect. Specifically:

- Use highlight for a small element that has a transparent background.

- Use lift for a small element that has an opaque background.

- Use hover for large elements and customize the scale, tint, and shadow attributes as needed (for guidance, see ).

Prefer the system-provided pointer appearances for standard buttons and text-entry areas. You can help people feel more comfortable with your app when the pointer behaves in ways they expect.

Add padding around interactive elements to create comfortable hit regions. You might need to experiment to determine the right size for an element’s hit region. If the hit region is too small, it can make people feel that they have to be extra precise when interacting with the element. On the other hand, when an element’s hit region is too large, people can feel that it takes a lot of effort to pull the pointer away from the element. In general, it works well to add about 12 points of padding around elements that include a bezel; for elements without a bezel, it works well to add about 24 points of padding around the element’s visible edges.

Create contiguous hit regions for custom bar buttons. If there’s space between the hit regions of adjacent buttons in a bar, people may experience a distracting motion when the pointer reverts briefly to its default shape as it moves between buttons.

Specify the corner radius of a nonstandard element that receives the lift effect. With the system-provided lift effect, the pointer transforms to match the element’s shape as it fades out. By default, the pointer uses the system-defined corner radius to transform into a rounded rectangle. If your element is a different shape — if it’s a circle, for example — you need to provide the radius so the pointer can animate seamlessly into the shape of the element. For developer guidance, see .


##### Customizing pointers

Prefer system-provided pointer effects for custom elements that behave like standard elements. When a custom element behaves like a standard one, people generally expect to interact with it using familiar pointer interactions. For example, if buttons in a custom toolbar don’t use the standard highlight effect, people might think they’re broken.

Use pointer effects in consistent ways throughout your app. For example, if your app helps people draw, provide a similar pointer experience for every drawing area in your app so that people can apply the knowledge they gain in one area to the others.

Avoid creating gratuitous pointer and content effects. People notice when the appearance of the pointer or the UI element beneath it changes, and they expect the changes to be useful. Creating a purely decorative pointer effect can distract and even irritate people without providing any practical value.

Keep custom pointer shapes simple. Ideally, the pointer’s shape signals the action people can take in the current context without drawing too much attention to itself. If people don’t instantly understand your custom pointer shape, they’re likely to waste time trying to discover what the shape means.

Consider enhancing the pointer experience by displaying custom annotations that provide useful information. For example, you could display X and Y values when people hold the pointer over a graphing area in your app. Keynote uses annotations to display the current width and height of a resizable image.

Avoid displaying instructional text with a pointer. A pointer that displays instructional text can make an app seem complicated and difficult to use. Instead of providing instructions, prioritize clarity and simplicity in your interface, so that people can quickly grasp how to use your app whether they’re using the pointer or touching the screen.

Consider the interplay of shadow, scale, and element spacing when defining custom hover effects. In general, reserve scaling for elements that can increase in size without crowding nearby elements. For example, scaling doesn’t work well for a table row because a row can’t expand without overlapping adjacent rows. For an element that has little space around it, consider using a hover effect that includes tint, but not scale and shadow. Note that it doesn’t work well to use shadow without including scale, because an unscaled element doesn’t appear to get closer to the viewer even when its shadow implies that it’s elevated above the screen.


#### macOS

macOS supports a wide range of standard mouse and trackpad interactions that people can customize. For example, when a click or gesture isn’t a primary way to interact with content, people can often turn it on or off based on their current workflow. People can also choose specific regions of a mouse or trackpad to invoke secondary clicks, and select specific finger combinations and movements for certain gestures.


##### Pointers

macOS offers a variety of standard pointer styles, which your app can use to communicate the interactive state of an interface element or the result of a drag operation.


#### visionOS

In visionOS, people can attach an external pointing device or keyboard, and use both devices while they continue to use their eyes and hands. If people look at an element and then move the pointer, the system brings focus to the element under the pointer. Your app doesn’t have to do anything to support this behavior.

When a pointing device is attached, the area people are looking at determines the pointer’s context. For example, when people shift their eyes from one window to another, the pointer’s context seamlessly transitions to the new window.

When people use an attached pointing device that supports gestures, like a trackpad or mouse, the pointer hides while people are gesturing, minimizing visual distraction. In this scenario, the pointer remains hidden until people move it, when it reappears in the location they’re looking at.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Charts

`/design/human-interface-guidelines/charts`

_Organize data in a chart to communicate information with clarity and visual appeal._

An effective chart highlights a few key pieces of information in a dataset, helping people gain insights and make decisions. For example, people might use a chart to:

- Learn how upcoming weather conditions might affect their plans.

- Analyze stock prices to understand past performance and discover trends.

- Review fitness data to monitor their progress and set new goals.

To learn about designing charts to enhance your experience, see ; for developer guidance, see .


### Anatomy

A chart comprises several graphical elements that depict the values in a dataset and convey information about them.

A mark is a visual representation of a data value. You create a chart by supplying one or more series of data values, assigning each value to a mark. To specify the style of chart you want to display — such as bar chart, line chart, or scatter plot — you choose a mark type, such as bar, line, or point (for guidance, see ). The general task of depicting individual data values in a chart is called plotting, and the area that contains the marks is called the plot area.

To depict a value, each type of mark uses visual attributes that are determined by a scale, which maps data values like numbers, dates, or categories to visual characteristics like position, color, or height. For example, a bar mark can use a particular height to represent the magnitude of a value and a particular position to represent the time at which the value occurred.

To give people the context they need to interpret a chart’s visual characteristics, you supply descriptive content that can take a few different forms.

You can use an axis to help define a frame of reference for the data represented by a set of marks. Many charts display a pair of axes at the edges of the plot area — one horizontal and one vertical — where each axis represents a variable like time, amount, or category.

An axis can include ticks, which are reference points that help people visually locate the position of important values along the axis, such as a 0, 50%, and 100%. Many charts display grid lines that each extend from a tick across the plot area to help people visually estimate a data value when its mark isn’t near an axis.

You also have multiple ways to describe chart elements to help people interpret the data and to highlight the key information you want to communicate. For example, you can supply labels that name items like axes, grid lines, ticks, or marks, and accessibility labels that describe chart elements for people who use assistive technologies. To provide context and additional details, you can create descriptive titles, subtitles, and annotations. When needed, you can also create a legend, which describes chart properties that aren’t related to a mark’s position, such as the use of color or shape to denote different value categories.

Clear, accurate descriptions can help make a chart more approachable and accessible; to learn about additional ways to improve the accessibility of your chart, see .


### Marks

Choose a mark type based on the information you want to communicate about the data. Some of the most familiar mark types are bar, line, and point; for developer guidance on these and other mark types, see .

Bar marks work well in charts that help people compare values in different categories or view the relative proportions of various parts in a whole. When used to help people understand data that changes over time, bar charts work especially well when each value can represent a sum, like the total number of steps taken in a day.

Line marks can also show how values change over time. In a line chart, a line connects all data values in one series of data. The slope of the line reveals the magnitude of change between data values and can help people visualize overall trends.

Point marks help you depict individual data values as visually distinct marks. A set of point marks can show how two different properties of your data relate to each other, helping people inspect individual data values and identify outliers and clusters.

Consider combining mark types when it adds clarity to your chart. For example, if you use a line chart to show a change over time, you might want to add point marks on top of the line to highlight individual data points. By combining points with a line, you can help people understand the overall trend while also drawing their attention to individual values.


### Axes

Use a fixed or dynamic axis range depending on the meaning of your chart. In a fixed range, the upper and lower bounds of the axis never change, whereas in a dynamic range, the upper and lower bounds can vary with the current data. Consider using a fixed range when specific minimum and maximum values are meaningful for all possible data values. For example, people expect a chart that shows a battery’s current charge to have a minimum value of 0% (completely empty) and a maximum value of 100% (completely full).

In contrast, consider using a dynamic range when the possible data values can vary widely and you want the marks to fill the available plot area. For example, the upper bound of the Y axis range in the Health app’s Steps chart varies so that the largest number of steps in a particular time period is close to the top of the chart.

Define the value of the lower bound based on mark type and chart usage. For example, bar charts can work well when you use zero for the lower bound of the Y axis, because doing so lets people visually compare the relative heights of individual bars to get a reasonable estimate of their values. In contrast, defining a lower bound of zero can sometimes make meaningful differences between values more difficult to discern. For example, a heart rate chart that always uses zero for the lower bound could obscure important differences between resting and active readings because the differences occur in a range that’s far from zero.

Prefer familiar sequences of values in the tick and grid-line labels for an axis. For example, if you use a common number sequence like 0, 5, 10, etc., people are likely to know at a glance that each tick value equals the previous value plus five. Even though a sequence like 1, 6, 11, etc., follows the same rule, it’s not common, so most people are likely to spend extra time thinking about the interval between values.

Tailor the appearance of grid lines and labels to a chart’s use cases. Too many grid lines can be visually overwhelming, distracting people from the data; too few grid lines can make it difficult to estimate a mark’s value. To help you determine the appropriate density and visual weight of these elements, consider a chart’s context in the interface, the interactions you support, and the tasks people can do in the chart. For example, if people can inspect individual data points by interacting with a chart, you might use fewer grid lines and light label colors to ensure the data remains visually prominent.


### Descriptive content

Write descriptions that help people understand what a chart does before they view it. When you provide information-rich titles and labels that describe the purpose and functionality of a chart, you give people the context they need before they dive in and examine the details. Providing context in this way is especially important for VoiceOver users and those with certain types of cognitive disabilities because they rely on your descriptions to understand the purpose and primary message of your chart before they decide to investigate it further.

Summarize the main message of your chart to help make it approachable and useful for everyone. Although a primary reason to use a chart is to display the data that supports the main message, it’s essential to summarize key information so that people can grasp it quickly. For example, Weather provides a title and subtitle that succinctly describe the expected precipitation for the next hour, giving people the most important information without requiring them to examine the details of the chart.


### Best practices

Establish a consistent visual hierarchy that helps communicate the relative importance of various chart elements. Typically, you want the data itself to be most prominent, while letting the descriptions and axes provide additional context without competing with the data.

In a compact environment, maximize the width of the plot area to give people enough space to comfortably examine a chart. To help important data fit well in a given width, ensure that labels on a vertical axis are as short as possible without losing clarity. You might also consider describing units in other areas of the chart, such as in a title, and placing a longer axis label, such as a category name, inside the plot area when doing so doesn’t obscure important information.

Make every chart in your app accessible. Charts — like all infographics — need to be fully accessible to everyone, regardless of how they perceive content. For example, it’s essential to support VoiceOver, which describes onscreen content to help people get information and navigate without needing to see the screen (to learn more about VoiceOver, see ). In addition to supplying accessibility labels that describe the components of your chart, you can enhance the VoiceOver experience by also using Audio Graphs.  provides chart information to VoiceOver, which constructs a set of tones that audibly represent a chart’s data values and their trend; it also lets you present high-level text summaries that provide additional context. For guidance, see .

Let people interact with the data when it makes sense, but don’t require interaction to reveal critical information. In Stocks, for example, people are often most interested in a stock’s performance over time, so the app displays a line graph that depicts performance during the time period people choose, such as one day, three months, or five years. If people want to explore additional details, they can drag a vertical indicator through the line graph, revealing the value at the selected time.

Make it easy for everyone to interact with a chart. Sometimes, chart marks are too small to target with a finger or a pointer, making your chart hard to use for people with reduced motor control and uncomfortable for everyone. When this is the case, consider expanding the hit target to include the entire plot area, letting people scrub across the area to reveal various values.

Make an interactive chart easy to navigate when using keyboard commands (including full keyboard access) or Switch Control. By default, these input types tend to visit individual onscreen elements in a linear sequence, such as the sequence of values in a data file. If you want to provide a custom navigation experience in your chart, here are two main ways to do so. The first way is to use accessibility APIs (such as ) to specify a logical and predictable path through your chart’s information. For example, you might want to let people navigate along the X axis instead of jumping back and forth. The second way — which is particularly useful if you need to present a very large dataset — is to let people move focus among subsets of values instead of navigating through all individual data points. Note that both of these customizations can also enhance the VoiceOver experience, even when your chart isn’t interactive. For guidance, see .

Help people notice important changes in a chart. For example, if people don’t notice when marks or axes change, they can misread a chart. Animating such changes can help people notice them, but you need to highlight the changes in other ways, too, to ensure that VoiceOver users and people who turn off animations know about them. For developer guidance, see  (UIKit) or  (AppKit).

Align a chart with surrounding interface elements. For example, it often works well to align the leading edge of a chart with the leading edge of other views in a screen. One way to maintain a clean leading edge in a chart is to display the label for each vertical grid line on its trailing side. You might also consider shifting the Y axis to the trailing side of the chart so that its tick labels don’t protrude past the chart’s leading edge. If you end up with a label that doesn’t appear to be associated with anything, you can use a tick to anchor it to a grid line.


### Color

As in all other parts of your interface, using color in a chart can help you clarify information, evoke your brand, and provide visual continuity. For general guidance on using color in ways that everyone can appreciate, see .

Avoid relying solely on color to differentiate between different pieces of data or communicate essential information in a chart. Using meaningful color in a chart works well to highlight differences and elevate key details, but it’s crucial to include alternative ways to convey this information so that people can use your chart regardless of whether they can discern colors. One way to supplement color is to use different shapes or patterns to depict different parts of data. For example, in addition to using red and black or red and white colors, Health uses two different shapes in the point marks that represent the two components of blood pressure.

Aid comprehension by adding visual separation between contiguous areas of color. For example, in a bar chart that stacks marks in a single row or column, it’s common to assign a different color to each mark. In this design, adding separators between the marks can help people distinguish individual ones.


### Enhancing the accessibility of a chart

When you use Swift Charts to create a chart, you get a default implementation of , in addition to a default accessibility element for each mark (or group of marks) that describes its value.

Consider using Audio Graphs to give VoiceOver users more information about your chart. You can customize the default Audio Graphs implementation that Swift Charts provides by supplying a chart title and descriptive summary that VoiceOver speaks to help people understand the purpose and main features of your chart. If you don’t use Audio Graphs, you need to provide an overview of the chart’s structure and purpose. For example, you need to identify the chart’s type — such as bar or line — explain what each axis represents, and describe details like the upper and lower axis bounds.

> [IMPORTANT] Unlike an image — which requires one descriptive accessibility label — a chart often needs to offer an accessibility label for each important or interactive element. Depending on the purpose of your chart and the scope and density of its marks, you need to decide whether it’s essential to describe each mark or whether it improves the accessibility experience to describe groups of marks. In some cases, it can make sense to use a single accessibility label that provides a succinct, high-level description of the chart, such as when you use a small version of a chart in a button that reveals a more detailed version.

Write accessibility labels that support the purpose of your chart. For example, Maps shows elevation for a cycling route using a chart that represents the change in elevation over the course of the route. The purpose of the chart is to give people a sense of the terrain for the entire route, not to provide individual elevations. For this reason, Maps provides accessibility labels that summarize the elevation changes over a portion of the route, rather than providing labels for each individual moment. In contrast, Health offers an accessibility label for each bar in the Steps chart, because the purpose of the chart is to give people their actual step count for each tracking period.

The following guidelines can help you write useful accessibility labels for chart elements.

- Prioritize clarity and comprehensiveness. In general, it’s rarely enough to merely report a data value unless you also include context that helps people understand it, like the date or location that’s associated with it. Aim to concisely describe the context for a value without repeating information that people can get in other ways, like an axis name that Audio Graphs or your overview provides. Follow context-setting information with a succinct description of the element’s details.

- Avoid using subjective terms. Subjective words — like rapidly, gradually, and almost — communicate your interpretation of the data. To help people form their own interpretations, use actual values in your descriptions.

- Maximize clarity in data descriptions by avoiding potentially ambiguous formats and abbreviations. For example, using “June 6” is clearer than using “6/6”; similarly, spelling out “60 minutes” or “60 meters” is clearer than using the abbreviation “60m.”

- Describe what the chart’s details represent, not what they look like. Consider a chart that uses red and blue colors to help people visually distinguish two different data series. It’s crucial to create accessibility labels that identify what each series represents, but describing the colors that visually represent them can add unnecessary information and be distracting.

- Be consistent throughout your app when referring to a specific axis. For example, if you always mention the X axis first, people can spend less time figuring out which axis is relevant in a description.

Hide visible text labels for axes and ticks from assistive technologies. Axis and tick labels help people visually assess trends in a chart and estimate mark values. VoiceOver users can get mark values and trend information through accessibility labels and Audio Graphs, so they don’t generally need the content in the visible labels.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, visionOS.


#### watchOS

In general, avoid requiring complex chart interactions in your watchOS app. As much as possible, prefer displaying useful information people can get at a glance and supporting simple interactions when they add value. If you also offer a version of your app in another platform, consider using it to display more details and to support additional interactions with your chart. For example, Heart Rate in watchOS displays a chart of the wearer’s heart-rate data for the current day, whereas the Health app on iPhone displays heart-rate data for several different periods of time and lets people examine individual marks.


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## Image views

`/design/human-interface-guidelines/image-views`

_An image view displays a single image — or in some cases, an animated sequence of images — on a transparent or opaque background._

Within an image view, you can stretch, scale, size to fit, or pin the image to a specific location. Image views are typically not interactive.


### Best practices

Use an image view when the primary purpose of the view is simply to display an image. In rare cases where you might want an image to be interactive, configure a system-provided  to display the image instead of adding button behaviors to an image view.

If you want to display an icon in your interface, consider using a symbol or interface icon instead of an image view.  provides a large library of streamlined, vector-based images that you can render with various colors and opacities. An  (also called a glyph or template image) is typically a bitmap image in which the nontransparent pixels can receive color. Both symbols and interface icons can use the accent colors people choose.


### Content

An image view can contain rich image data in various formats, like PNG, JPEG, and PDF. For more guidance, see .

Take care when overlaying text on images. Compositing text on top of images can decrease both the clarity of the image and the legibility of the text. To help improve the results, ensure the text contrasts well with the image, and consider ways to make the text object stand out, like adding a text shadow or background layer.

Aim to use a consistent size for all images in an animated sequence. When you prescale images to fit the view, the system doesn’t have to perform any scaling. In cases where the system must do the scaling, performance is generally better when all images are the same size and shape.


### Platform considerations

No additional considerations for iOS or iPadOS.


#### macOS

If your app needs an editable image view, use an image well. An  is an image view that supports copying, pasting, dragging, and using the Delete key to clear its content.

Use an image button instead of an image view to make a clickable image. An  contains an image or icon, appears in a view, and initiates an instantaneous app-specific action.


#### tvOS

Many tvOS images combine multiple layers with transparency to create a feeling of depth. For guidance, see .


#### visionOS

Windows in visionOS apps and games can use image views to display 2D and stereoscopic images, as well as spatial photos. If your app uses RealityKit, you can also display images of any type outside of image views next to 3D content, or generate a spatial scene from an existing 2D image. For design guidance, see ; for developer guidance, see .

For guidance on presenting other 3D content in a window or volume, see .


#### watchOS

Use SwiftUI to create animations when possible. Alternatively, you can use WatchKit to animate a sequence of images within an image element if necessary. For developer guidance, see .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Text views

`/design/human-interface-guidelines/text-views`

_A text view displays multiline, styled text content, which can optionally be editable._

Text views can be any height and allow scrolling when the content extends outside of the view. By default, content within a text view is aligned to the leading edge and uses the system label color. In iOS, iPadOS, and visionOS, if a text view is editable, a keyboard appears when people select the view.


### Best practices

Use a text view when you need to display text that’s long, editable, or in a special format. Text views differ from  and  in that they provide the most options for displaying specialized text and receiving text input. If you need to display a small amount of text, it’s simpler to use a label or — if the text is editable — a text field.

Keep text legible. Although you can use multiple fonts, colors, and alignments in creative ways, it’s essential to maintain the readability of your content. It’s a good idea to adopt Dynamic Type so your text still looks good if people change text size on their device. Be sure to test your content with accessibility options turned on, such as bold text. For guidance, see  and .

Make useful text selectable. If a text view contains useful information such as an error message, a serial number, or an IP address, consider letting people select and copy it for pasting elsewhere.


### Platform considerations

No additional considerations for macOS, visionOS, or watchOS.


#### iOS, iPadOS

Show the appropriate keyboard type. Several different keyboard types are available, each designed to facilitate a different type of input. To streamline data entry, the keyboard you display when editing a text view needs to be appropriate for the type of content. For guidance, see .


#### tvOS

You can display text in tvOS using a text view. Because text input in tvOS is minimal by design, tvOS uses  for editable text instead.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Web views

`/design/human-interface-guidelines/web-views`

_A web view loads and displays rich web content, such as embedded HTML and websites, directly within your app._

For example, Mail uses a web view to show HTML content in messages.


### Best practices

Support forward and back navigation when appropriate. Web views support forward and back navigation, but this behavior isn’t available by default. If people are likely to use your web view to visit multiple pages, allow forward and back navigation, and provide corresponding controls to initiate these features.

Avoid using a web view to build a web browser. Using a web view to let people briefly access a website without leaving the context of your app is fine, but Safari is the primary way people browse the web. Attempting to replicate the functionality of Safari in your app is unnecessary and discouraged.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, or visionOS. Not supported in tvOS or watchOS.


### Resources


##### Related


##### Developer documentation

 — WebKit


##### Videos

---

## Boxes

`/design/human-interface-guidelines/boxes`

_A box creates a visually distinct group of logically related information and components._

By default, a box uses a visible border or background color to separate its contents from the rest of the interface. A box can also include a title.


### Best practices

Prefer keeping a box relatively small in comparison with its containing view. As a box’s size gets close to the size of the containing window or screen, it becomes less effective at communicating the separation of grouped content, and it can crowd other content.

Consider using padding and alignment to communicate additional grouping within a box. A box’s border is a distinct visual element — adding nested boxes to define subgroups can make your interface feel busy and constrained.


### Content

Provide a succinct introductory title if it helps clarify the box’s contents. The appearance of a box helps people understand that its contents are related, but it might make sense to provide more detail about the relationship. Also, a title can help VoiceOver users predict the content they encounter within the box.

If you need a title, write a brief phrase that describes the contents. Use sentence-style capitalization. Avoid ending punctuation unless you use a box in a settings pane, where you append a colon to the title.


### Platform considerations

No additional considerations for visionOS. Not supported in tvOS or watchOS.


#### iOS, iPadOS

By default, iOS and iPadOS use the secondary and tertiary background  in boxes.


#### macOS

By default, macOS displays a box’s title above it.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — AppKit

---

## Collections

`/design/human-interface-guidelines/collections`

_A collection manages an ordered set of content and presents it in a customizable and highly visual layout._

Generally speaking, collections are ideal for showing image-based content.


### Best practices

Use the standard row or grid layout whenever possible. Collections display content by default in a horizontal row or a grid, which are simple, effective appearances that people expect. Avoid creating a custom layout that might confuse people or draw undue attention to itself.

Consider using a table instead of a collection for text. It’s generally simpler and more efficient to view and digest textual information when it’s displayed in a scrollable list.

Make it easy to choose an item. If it’s too difficult to get to an item in your collection, people will get frustrated and lose interest before reaching the content they want. Use adequate padding around images to keep focus or hover effects easy to see and prevent content from overlapping.

Add custom interactions when necessary. By default, people can tap to select, touch and hold to edit, and swipe to scroll. If your app requires it, you can add more gestures for performing custom actions.

Consider using animations to provide feedback when people insert, delete, or reorder items. Collections support standard animations for these actions, and you can also use custom animations.


### Platform considerations

No additional considerations for macOS, tvOS, or visionOS. Not supported in watchOS.


#### iOS, iPadOS

Use caution when making dynamic layout changes. The layout of a collection can change dynamically. Be sure any changes make sense and are easy to track. If possible, try to avoid changing the layout while people are viewing and interacting with it, unless it’s in response to an explicit action.


### Resources


##### Related


##### Developer documentation

 — UIKit

 — AppKit

---

## Column views

`/design/human-interface-guidelines/column-views`

_A column view — also called a  — lets people view and navigate a data hierarchy using a series of vertical columns._

Each column represents one level of the hierarchy and contains horizontal rows of data items. Within a column, any parent item that contains nested child items is marked with a triangle icon. When people select a parent, the next column displays its children. People can continue navigating in this way until they reach an item with no children, and can also navigate back up the hierarchy to explore other branches of data.

> [NOTE] If you need to manage the presentation of hierarchical content in your iPadOS or visionOS app, consider using a .


### Best practices

Consider using a column view when you have a deep data hierarchy in which people tend to navigate back and forth frequently between levels, and you don’t need the sorting capabilities that a  provides. For example, Finder offers a column view (in addition to icon, list, and gallery views) for navigating directory structures.

Show the root level of your data hierarchy in the first column. People know they can quickly scroll back to the first column to begin navigating the hierarchy from the top again.

Consider showing information about the selected item when there are no nested items to display. The Finder, for example, shows a preview of the selected item and information like the creation date, modification date, file type, and size.

Let people resize columns. This is especially important if the names of some data items are too long to fit within the default column width.


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

---

## Disclosure controls

`/design/human-interface-guidelines/disclosure-controls`

_Disclosure controls reveal and hide information and functionality related to specific controls or views._


### Best practices

Use a disclosure control to hide details until they’re relevant. Place controls that people are most likely to use at the top of the disclosure hierarchy so they’re always visible, with more advanced functionality hidden by default. This organization helps people quickly find the most essential information without overwhelming them with too many detailed options.


### Disclosure triangles

A disclosure triangle shows and hides information and functionality associated with a view or a list of items. For example, Keynote uses a disclosure triangle to show advanced options when exporting a presentation, and the Finder uses disclosure triangles to progressively reveal hierarchy when navigating a folder structure in list view.

A disclosure triangle points inward from the leading edge when its content is hidden and down when its content is visible. Clicking or tapping the disclosure triangle switches between these two states, and the view expands or collapses accordingly to accommodate the content.

Provide a descriptive label when using a disclosure triangle. Make sure your labels indicate what is disclosed or hidden, like “Advanced Options.”

For developer guidance, see .


### Disclosure buttons

A disclosure button shows and hides functionality associated with a specific control. For example, the macOS Save sheet shows a disclosure button next to the Save As text field. When people click or tap this button, the Save dialog expands to give advanced navigation options for selecting an output location for their document.

A disclosure button points down when its content is hidden and up when its content is visible. Clicking or tapping the disclosure button switches between these two states, and the view expands or collapses accordingly to accommodate the content.

Place a disclosure button near the content that it shows and hides. Establish a clear relationship between the control and the expanded choices that appear when a person clicks or taps a button.

Use no more than one disclosure button in a single view. Multiple disclosure buttons add complexity and can be confusing.

For developer guidance, see .


### Platform considerations

No additional considerations for macOS. Not supported in tvOS or watchOS.


#### iOS, iPadOS, visionOS

Disclosure controls are available in iOS, iPadOS, and visionOS with the SwiftUI  view.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — AppKit

 — AppKit


##### Videos

---

## Labels

`/design/human-interface-guidelines/labels`

_A label is a static piece of text that people can read and often copy, but not edit._

Labels display text throughout the interface, in buttons, menu items, and views, helping people understand the current context and what they can do next.

The term label refers to uneditable text that can appear in various places. For example:

- Within a button, a label generally conveys what the button does, such as Edit, Cancel, or Send.

- Within many lists, a label can describe each item, often accompanied by a symbol or an image.

- Within a view, a label might provide additional context by introducing a control or describing a common action or task that people can perform in the view.

> [NOTE] To display uneditable text, SwiftUI defines two components:  and .

The guidance below can help you use a label to display text. In some cases, guidance for specific components — such as , , and  — includes additional recommendations for using text.


### Best practices

Use a label to display a small amount of text that people don’t need to edit. If you need to let people edit a small amount of text, use a . If you need to display a large amount of text, and optionally let people edit it, use a .

Prefer system fonts. A label can display plain or styled text, and it supports Dynamic Type (where available) by default. If you adjust the style of a label or use custom fonts, make sure the text remains legible.

Use system-provided label colors to communicate relative importance. The system defines four label colors that vary in appearance to help you give text different levels of visual importance. For additional guidance, see .

Make useful label text selectable. If a label contains useful information — like an error message, a location, or an IP address — consider letting people select and copy it for pasting elsewhere.


### Platform considerations

No additional considerations for iOS, iPadOS, tvOS, or visionOS.


#### macOS

> [NOTE] To display uneditable text in a label, use the  property of .


#### watchOS

Date and time text components (shown below on the left) display the current date, the current time, or a combination of both. You can configure a date text component to use a variety of formats, calendars, and time zones. A countdown timer text component (shown below on the right) displays a precise countdown or count-up timer. You can configure a timer text component to display its count value in a variety of formats.

When you use the system-provided date and timer text components, watchOS automatically adjusts the label’s presentation to fit the available space. The system also updates the content without further input from your app.

Consider using date and timer components in complications. For design guidance, see ; for developer guidance, see .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Lists and tables

`/design/human-interface-guidelines/lists-and-tables`

_Lists and tables present data in one or more columns of rows._

A table or list can represent data that’s organized in groups or hierarchies, and it can support user interactions like selecting, adding, deleting, and reordering. Apps and games in all platforms can use tables to present content and options; many apps use lists to express an overall information hierarchy and help people navigate it. For example, iOS Settings uses a hierarchy of lists to help people choose options, and several apps — such as Mail in iPadOS and macOS — use a table within a .

Sometimes, people need to work with complex data in a multicolumn table or a spreadsheet. Apps that offer productivity tasks often use a table to represent various characteristics or attributes of the data in separate, sortable columns.


### Best practices

Prefer displaying text in a list or table. A table can include any type of content, but the row-based format is especially well suited to making text easy to scan and read. If you have items that vary widely in size — or you need to display a large number of images — consider using a  instead.

Let people edit a table when it makes sense. People appreciate being able to reorder a list, even if they can’t add or remove items. In iOS and iPadOS, people must enter an edit mode before they can select table items.

Provide appropriate feedback when people select a list item. The feedback can vary depending on whether selecting the item reveals a new view or toggles the item’s state. In general, a table that helps people navigate through a hierarchy persistently highlights the selected row to clarify the path people are taking. In contrast, a table that lists options often highlights a row only briefly before adding an image — such as a checkmark — indicating that the item is selected.


### Content

Keep item text succinct so row content is comfortable to read. Short, succinct text can help minimize truncation and wrapping, making text easier to read and scan. If each item consists of a large amount of text, consider alternatives that help you avoid displaying over-large table rows. For example, you could list item titles only, letting people choose an item to reveal its content in a detail view.

Consider ways to preserve readability of text that might otherwise get clipped or truncated. When a table is narrow — for example, if people can vary its width — you want content to remain recognizable and easy to read. Sometimes, an ellipsis in the middle of text can make an item easier to distinguish because it preserves both the beginning and the end of the content.

Use descriptive column headings in a multicolumn table. Use nouns or short noun phrases with , and don’t add ending punctuation. If you don’t include a column heading in a single-column table view, use a label or a header to help people understand the context.


### Style

Choose a table or list style that coordinates with your data and platform. Some styles use visual details to help communicate grouping and hierarchy or to provide specific experiences. In iOS and iPadOS, for example, the grouped style uses headers, footers, and additional space to separate groups of data; the elliptical style available in watchOS makes items appear as if they’re rolling off a rounded surface as people scroll; and macOS defines a bordered style that uses alternating row backgrounds to help make large tables easier to use. For developer guidance, see .

Choose a row style that fits the information you need to display. For example, you might need to display a small image in the leading end of a row, followed by a brief explanatory label. Some platforms provide built-in row styles you can use to arrange content in list rows, such as the  API you can use to lay out content in a list’s rows, headers, and footers in iOS, iPadOS, and tvOS.


### Platform considerations


#### iOS, iPadOS, visionOS

Use an info button only to reveal more information about a row’s content. An info button — called a detail disclosure button when it appears in a list row — doesn’t support navigation through a hierarchical table or list. If you need to let people drill into a list or table row’s subviews, use a disclosure indicator accessory control. For developer guidance, see .

Avoid adding an index to a table that displays controls — like disclosure indicators — in the trailing ends of its rows. An index typically consists of the letters in an alphabet, displayed vertically at the trailing side of a list. People can jump to a specific section in the list by choosing the index letter that maps to it. Because both the index and elements like disclosure indicators appear on the trailing side of a list, it can be difficult for people to use one element without activating the other.


#### macOS

When it provides value, let people click a column heading to sort a table view based on that column. If people click the heading of a column that’s already sorted, re-sort the data in the opposite direction.

Let people resize columns. Data displayed in a table view often varies in width. People appreciate resizing columns to help them concentrate on different areas or reveal clipped data.

Consider using alternating row colors in a multicolumn table. Alternating colors can help people track row values across columns, especially in a wide table.

Use an outline view instead of a table view to present hierarchical data. An  looks like a table view, but includes disclosure triangles for exposing nested levels of data. For example, an outline view might display folders and the items they contain.


#### tvOS

Confirm that images near a table still look good as each row highlights and slightly increases in size when it becomes focused. A focused row’s corners can also become rounded, which may affect the appearance of images on either side of it. Account for this effect as you prepare images, and don’t add your own masks to round the corners.


#### watchOS

When possible, limit the number of rows. Short lists are easier for people to scan, but sometimes people expect a long list of items. For example, if people subscribe to a large number of podcasts, they might think something’s wrong if they can’t view all their items. You can help make a long list more manageable by listing the most relevant items and providing a way for people to view more.

Constrain the length of detail views if you want to support vertical page-based navigation. People use vertical page-based navigation to swipe vertically among the detail items of different list rows. Navigating in this way saves time because people don’t need to return to the list to tap a new detail item, but it works only when detail views are short. If your detail views scroll, people won’t be able to use vertical page-based navigation to swipe among them.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Lockups

`/design/human-interface-guidelines/lockups`

_Lockups combine multiple separate views into a single, interactive unit._

Each lockup consists of a content view, a header, and a footer. Headers appear above the main content for a lockup, and footers appear below the main content. All three views expand and contract together as the lockup gets focus.

According to the needs of your app, you can combine four types of lockup: cards, caption buttons, monograms, and posters.


### Best practices

Allow adequate space between lockups. A focused lockup expands in size, so leave enough room between lockups to avoid overlapping or displacing other lockups. For guidance, see .

Use consistent lockup sizes within a row or group. A group of buttons or a row of content images is more visually appealing when the widths and heights of all elements match.

For developer guidance, see  and .


### Cards

A card combines a header, footer, and content view to present ratings and reviews for media items.

For developer guidance, see .


### Caption buttons

A caption button can include a title and a subtitle beneath the button. A caption button can contain either an image or text.

Make sure that when people focus on them, caption buttons tilt with the motion that they swipe. When aligned vertically, caption buttons tilt up and down. When aligned horizontally, caption buttons tilt left and right. When displayed in a grid, caption buttons tilt both vertically and horizontally.

For developer guidance, see .


### Monograms

Monograms identify people, usually the cast and crew for a media item. Each monogram consists of a circular picture of the person and their name. If an image isn’t available, the person’s initials appear in place of an image.

Prefer images over initials. An image of a person creates a more intimate connection than text.

For developer guidance, see .


### Posters

Posters consist of an image and an optional title and subtitle, which are hidden until the poster comes into focus. Posters can be any size, but the size needs to be appropriate for their content. For related guidance, see .

For developer guidance, see .


### Platform considerations

Not supported in iOS, iPadOS, macOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — TVUIKit

 — TVUIKit

---

## Outline views

`/design/human-interface-guidelines/outline-views`

_An outline view presents hierarchical data in a scrolling list of cells that are organized into columns and rows._

An outline view includes at least one column that contains primary hierarchical data, such as a set of parent containers and their children. You can add columns, as needed, to display attributes that supplement the primary data; for example, sizes and modification dates. Parent containers have disclosure triangles that expand to reveal their children.

Finder windows offer an outline view for navigating the file system.


### Best practices

Outline views work well to display text-based content and often appear in the leading side of a , with related content on the opposite side.

Use a table instead of an outline view to present data that’s not hierarchical. For guidance, see .

Expose data hierarchy in the first column only. Other columns can display attributes that apply to the hierarchical data in the primary column.

Use descriptive column headings to provide context. Use nouns or short noun phrases with  and no punctuation; in particular, avoid adding a trailing colon. Always provide column headings in a multi-column outline view. If you don’t include a column heading in a single-column outline view, use a label or other means to make sure there’s enough context.

Consider letting people click column headings to sort an outline view. In a sortable outline view, people can click a column heading to perform an ascending or descending sort based on that column. You can implement additional sorting based on secondary columns behind the scenes, if necessary. If people click the primary column heading, sorting occurs at each hierarchy level. For example, in the Finder, all top-level folders are sorted, then the items within each folder are sorted. If people click the heading of a column that’s already sorted, the folders and their contents are sorted again in the opposite direction.

Let people resize columns. Data displayed in an outline view often varies in width. It’s important to let people adjust column width as needed to reveal data that’s wider than the column.

Make it easy for people to expand or collapse nested containers. For example, clicking a disclosure triangle for a folder in a Finder window expands only that folder. However, Option-clicking the disclosure triangle expands all of its subfolders.

Retain people’s expansion choices. If people expand various levels of an outline view to reach a specific item, store the state so you can display it again the next time. This way, people won’t need to navigate back to the same place again.

Consider using alternating row colors in multi-column outline views. Alternating colors can make it easier for people to track row values across columns, especially in wide outline views.

Let people edit data if it makes sense in your app. In an editable outline view cell, people expect to be able to single-click a cell to edit its contents. Note that a cell can respond differently to a double click. For example, an outline view listing files might let people single-click a file’s name to edit it, but double-click a file’s name to open the file. You can also let people reorder, add, and remove rows if it would be useful.

Consider using a centered ellipsis to truncate cell text instead of clipping it. An ellipsis in the middle preserves the beginning and end of the cell text, which can make the content more distinct and recognizable than clipped text.

Consider offering a search field to help people find values quickly in a lengthy outline view. Windows with an outline view as the primary feature often include a search field in the toolbar. For guidance, see .


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — AppKit


##### Videos

---

## Split views

`/design/human-interface-guidelines/split-views`

_A split view manages the presentation of multiple adjacent panes of content, each of which can contain a variety of components, including tables, collections, images, and custom views._

Typically, you use a split view to show multiple levels of your app’s hierarchy at once and support navigation between them. In this scenario, selecting an item in the view’s primary pane displays the item’s contents in the secondary pane. Similarly, a split view can display a tertiary pane if items in the secondary pane contain additional content.

It’s common to use a split view to display a  for navigation, where the leading pane lists the top-level items or collections in an app, and the secondary and optional tertiary panes can present child collections and item details. Rarely, you might also use a split view to provide groups of functionality that supplement the primary view — for example, Keynote in macOS uses split view panes to present the slide navigator, the presenter notes, and the inspector pane in areas that surround the main slide canvas.


### Best practices

To support navigation, persistently highlight the current selection in each pane that leads to the detail view. The selected appearance clarifies the relationship between the content in various panes and helps people stay oriented.

Consider letting people drag and drop content between panes. Because a split view provides access to multiple levels of hierarchy, people can conveniently move content from one part of your app to another by dragging items to different panes. For guidance, see .


### Platform considerations


#### iOS

Prefer using a split view in a regular — not a compact — environment. A split view needs horizontal space in which to display multiple panes. In a compact environment, such as iPhone in portrait orientation, it’s difficult to display multiple panes without wrapping or truncating the content, making it less legible and harder to interact with.


#### iPadOS

In iPadOS, a split view can include either two vertical panes, like Mail, or three vertical panes, like Keynote.

Account for narrow, compact, and intermediate window widths. Since iPad windows are fluidly resizable, it’s important to consider the design of a split view layout at multiple widths. In particular, ensure that it’s possible to navigate between the various panes in a logical way. For guidance, see . For developer guidance, see  and .


#### macOS

In macOS, you can arrange the panes of a split view vertically, horizontally, or both. A split view includes dividers between panes that can support dragging to resize them. For developer guidance, see  and .

Set reasonable defaults for minimum and maximum pane sizes. If people can resize the panes in your app’s split view, make sure to use sizes that keep the divider visible. If a pane gets too small, the divider can seem to disappear, becoming difficult to use.

Consider letting people hide a pane when it makes sense. If your app includes an editing area, for example, consider letting people hide other panes to reduce distractions or allow more room for editing — in Keynote, people can hide the navigator and presenter notes panes when they want to edit slide content.

Provide multiple ways to reveal hidden panes. For example, you might provide a toolbar button or a menu command — including a keyboard shortcut — that people can use to restore a hidden pane.

Prefer the thin divider style. The thin divider measures one point in width, giving you maximum space for content while remaining easy for people to use. Avoid using thicker divider styles unless you have a specific need. For example, if both sides of a divider present table rows that use strong linear elements that might make a thin divider hard to distinguish, it might work to use a thicker divider. For developer guidance, see .


#### tvOS

In tvOS, a split view can work well to help people filter content. When people choose a filter category in the primary pane, your app can display the results in the secondary pane.

Choose a split view layout that keeps the panes looking balanced. By default, a split view devotes a third of the screen width to the primary pane and two-thirds to the secondary pane, but you can also specify a half-and-half layout.

Display a single title above a split view, helping people understand the content as a whole. People already know how to use a split view to navigate and filter content; they don’t need titles that describe what each pane contains.

Choose the title’s alignment based on the type of content the secondary pane contains. Specifically, when the secondary pane contains a content collection, consider centering the title in the window. In contrast, if the secondary pane contains a single main view of important content, consider placing the title above the primary view to give the content more room.


#### visionOS

To display supplementary information, prefer a split view instead of a new window. A split view gives people convenient access to more information without leaving the current context, whereas a new window may confuse people who are trying to navigate or reposition content. Opening more windows also requires you to carefully manage the relationship between views in your app or game. If you need to request a small amount of information or present a simple task that someone must complete before returning to their main task, use a .


#### watchOS

In watchOS, the split view displays either the list view or a detail view as a full-screen view.

Automatically display the most relevant detail view. When your app launches, show people the most pertinent information. For example, display information relevant to their location, the time, or their recent actions.

If your app displays multiple detail pages, place the detail views in a vertical . People can then use the Digital Crown to scroll between the detail view’s tabs. watchOS also displays a page indicator next to the Digital Crown, indicating the number of tabs and the currently selected tab.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Tab views

`/design/human-interface-guidelines/tab-views`

_A tab view presents multiple mutually exclusive panes of content in the same area, which people can switch between using a tabbed control._


### Best practices

Use a tab view to present closely related areas of content. The appearance of a tab view provides a strong visual indication of enclosure. People expect each tab to display content that is in some way similar or related to the content in the other tabs.

Make sure the controls within a pane affect content only in the same pane. Panes are mutually exclusive, so ensure they’re fully self-contained.

Provide a label for each tab that describes the contents of its pane. A good label helps people predict the contents of a pane before clicking or tapping its tab. In general, use nouns or short noun phrases for tab labels. A verb or short verb phrase may make sense in some contexts. Use title-style capitalization for tab labels.

Avoid using a pop-up button to switch between tabs. A tabbed control is efficient because it requires a single click or tap to make a selection, whereas a pop-up button requires two. A tabbed control also presents all choices onscreen at the same time, whereas people must click a pop-up button to see its choices. Note that a pop-up button can be a reasonable alternative in cases where there are too many panes of content to reasonably display with tabs.

Avoid providing more than six tabs in a tab view. Having more than six tabs can be overwhelming and create layout issues. If you need to present six or more tabs, consider another way to implement the interface. For example, you could instead present each tab as a view option in a pop-up button menu.

For developer guidance, see .


### Anatomy

The tabbed control appears on the top edge of the content area. You can choose to hide the control, which is appropriate for an app that switches between panes programmatically.

When you hide the tabbed control, the content area can be borderless, bezeled, or bordered with a line. A borderless view can be solid or transparent.

In general, inset a tab view by leaving a margin of window-body area on all sides of a tab view. This layout looks clean and leaves room for additional controls that aren’t directly related to the contents of the tab view. You can extend a tab view to meet the window edges, but this layout is unusual.


### Platform considerations

Not supported in iOS, iPadOS, tvOS, or visionOS.


#### iOS, iPadOS

For similar functionality, consider using a  instead.


#### watchOS

watchOS displays tab views using . For developer guidance, see .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — AppKit


### Change log

---

## Activity views

`/design/human-interface-guidelines/activity-views`

_An activity view — often called a  — presents a range of tasks that people can perform in the current context._

Activity views present sharing activities like messaging and actions like Copy and Print, in addition to quick access to frequently used apps. People typically reveal a share sheet by choosing an Action button while viewing a page or document, or after they’ve selected an item. An activity view can appear as a sheet or a popover, depending on the device and orientation.

You can provide app-specific activities that can appear in a share sheet when people open it within your app or game. For example, Photos provides app-specific actions like Copy Photo, Add to Album, and Adjust Location. By default, the system lists app-specific actions before actions — such as Add to Files or AirPlay — that are available in multiple apps or throughout the system. People can edit the list of actions to ensure that it displays the ones they use most and to add new ones.

You can also create app extensions to provide custom share and action activities that people can use in other apps. (An app extension is code you provide that people can install and use outside of your app.) For example, you might create a custom share activity that people can install to help them share a webpage with a specific social media service. Even though macOS doesn’t provide an activity view, you can create share and action app extensions that people can use on a Mac. For guidance, see .


### Best practices

Avoid creating duplicate versions of common actions that are already available in the activity view. For example, providing a duplicate Print action is unnecessary and confusing because people wouldn’t know how to distinguish your action from the system-provided one. If you need to provide app-specific functionality that’s similar to an existing action, give it a custom title. For example, if you let people use custom formatting to print a bank transaction, use a title that helps people understand what your print activity does, like “Print Transaction.”

Consider using a symbol to represent your custom activity.  provides a comprehensive set of configurable symbols you can use to communicate items and concepts in an activity view. If you need to create a custom interface icon, center it in an area measuring about 70x70 pixels. For guidance, see .

Write a succinct, descriptive title for each custom action you provide. If a title is too long, the system wraps it and may truncate it. Prefer a single verb or a brief verb phrase that clearly communicates what the action does. Avoid including your company or product name in an action title. In contrast, the share sheet displays the title of a share activity — typically a company name — below the icon that represents it.

Make sure activities are appropriate for the current context. Although you can’t reorder system-provided tasks in an activity view, you can exclude tasks that aren’t applicable to your app. For example, if it doesn’t make sense to print from within your app, you can exclude the Print activity. You can also identify which custom tasks to show at any given time.

Use the Share button to display an activity view. People are accustomed to accessing system-provided activities when they choose the Share button. Avoid confusing people by providing an alternative way to do the same thing.


### Share and action extensions

Share extensions give people a convenient way to share information from the current context with apps, social media accounts, and other services. Action extensions let people initiate content-specific tasks — like adding a bookmark, copying a link, editing an inline image, or displaying selected text in another language — without leaving the current context.

The system presents share and action extensions differently depending on the platform:

- In iOS and iPadOS, share and action extensions are displayed in the share sheet that appears when people choose an Action button.

- In macOS, people access share extensions by clicking a Share button in the toolbar or choosing Share in a context menu. People can access an action extension by holding the pointer over certain types of embedded content — like an image they add to a Mail compose window — clicking a toolbar button, or choosing a quick action in a Finder window.

If necessary, create a custom interface that feels familiar to people. For a share extension, prefer the system-provided composition view because it provides a consistent sharing experience that people already know. For an action extension, include your app name. If you need to present an interface, include elements of your app’s interface to help people understand that your extension and your app are related.

Streamline and limit interaction. People appreciate extensions that let them perform a task in just a few steps. For example, a share extension might immediately post an image to a social media account with a single tap or click.

Avoid placing a modal view above your extension. By default, the system displays an extension within a modal view. While it might be necessary to display an alert above an extension, avoid displaying additional modal views.

If necessary, provide an image that communicates the purpose of your extension. A share extension automatically uses your app icon, helping give people confidence that your app provided the extension. For an action extension, prefer using a  or creating an interface  that clearly identifies the task.

Use your main app to denote the progress of a lengthy operation. An activity view dismisses immediately after people complete the task in your share or action extension. If a task is time-consuming, continue it in the background, and give people a way to check the status in your main app. Although you can use a notification to tell people about a problem, don’t notify them simply because the task completes.


### Platform considerations

No additional considerations for iOS, iPadOS, or visionOS. Not supported in macOS, tvOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — UIKit

 — UIKit

 — Foundation


##### Videos

---

## Buttons

`/design/human-interface-guidelines/buttons`

_A button initiates an instantaneous action._

Versatile and highly customizable, buttons give people simple, familiar ways to do tasks in your app. In general, a button combines three attributes to clearly communicate its function:

- Style. A visual style based on size, color, and shape.

- Content. A symbol (or icon), text label, or both that a button displays to convey its purpose.

- Role. A system-defined role that identifies a button’s semantic meaning and can affect its appearance.

There are also many button-like components that have distinct appearances and behaviors for specific use cases, like , , and .


### Best practices

When buttons are instantly recognizable and easy to understand, an app tends to feel intuitive and well designed.

Make buttons easy for people to use. It’s essential to include enough space around a button so that people can visually distinguish it from surrounding components and content. Giving a button enough space is also critical for helping people select or activate it, regardless of the method of input they use. As a general rule, a button needs a hit region of at least 44x44 pt — in visionOS, 60x60 pt — to ensure that people can select it easily, whether they use a fingertip, a pointer, their eyes, or a remote.

Always include a press state for a custom button. Without a press state, a button can feel unresponsive, making people wonder if it’s accepting their input.


### Style

System buttons offer a range of styles that support customization while providing built-in interaction states, accessibility support, and appearance adaptation. Different platforms define different styles that help you communicate hierarchies of actions in your app.

In general, use a button that has a prominent visual style for the most likely action in a view. To draw people’s attention to a specific button, use a prominent button style so the system can apply an accent color to the button’s background. Buttons that use color tend to be the most visually distinctive, helping people quickly identify the actions they’re most likely to use. Keep the number of prominent buttons to one or two per view. Presenting too many prominent buttons increases cognitive load, requiring people to spend more time considering options before making a choice.

Use style — not size — to visually distinguish the preferred choice among multiple options. When you use buttons of the same size to offer two or more options, you signal that the options form a coherent set of choices. By contrast, placing two buttons of different sizes near each other can make the interface look confusing and inconsistent. If you want to highlight the preferred or most likely option in a set, use a more prominent button style for that option and a less prominent style for the remaining ones.

Avoid applying a similar color to button labels and content layer backgrounds. If your app already has bright, colorful content in the content layer, prefer using the default monochromatic appearance of button labels. For more guidance, see .


### Content

Ensure that each button clearly communicates its purpose. Depending on the platform, a button can contain a symbol (or icon), a text label, or both to help people understand what it does.

> [NOTE] In macOS and visionOS, the system displays a tooltip after people hover over a button for a moment. A tooltip displays a brief phrase that explains what a button does; for guidance, see .

Try to associate familiar actions with familiar icons. For example, people can predict that a button containing the `square.and.arrow.up` symbol will help them perform share-related activities. If it makes sense to use an icon in your button, consider using an existing or customized . For a list of symbols that represent common actions, see .

Consider using text when a short label communicates more clearly than an icon. To use text, write a few words that succinctly describe what the button does. Using , consider starting the label with a verb to help convey the button’s action — for example, a button that lets people add items to their shopping cart might use the label “Add to Cart.”


### Role

A system button can have one of the following roles:

- Normal. No specific meaning.

- Primary. The button is the default button — the button people are most likely to choose.

- Cancel. The button cancels the current action.

- Destructive. The button performs an action that can result in data destruction.

A button’s role can have additional effects on its appearance. For example, a primary button uses an app’s accent color, whereas a destructive button uses the system red color.

Assign the primary role to the button people are most likely to choose. When a primary button responds to the Return key, it makes it easy for people to quickly confirm their choice. In addition, when the button is in a temporary view — like a , an editable view, or an  — assigning it the primary role means that the view can automatically close when people press Return.

Don’t assign the primary role to a button that performs a destructive action, even if that action is the most likely choice. Because of its visual prominence, people sometimes choose a primary button without reading it first. Help people avoid losing content by assigning the primary role to nondestructive buttons.


### Platform considerations

No additional considerations for tvOS.


#### iOS, iPadOS

Configure a button to display an activity indicator when you need to provide feedback about an action that doesn’t instantly complete. Displaying an activity indicator within a button can save space in your user interface while clearly communicating the reason for the delay. To help clarify what’s happening, you can also configure the button to display a different label alongside the activity indicator. For example, the label “Checkout” could change to “Checking out…” while the activity indicator is visible. When a delay occurs after people click or tap your configured button, the system displays the activity indicator next to the original or alternative label, hiding the button image, if there is one.


#### macOS

Several specific button types are unique to macOS.


##### Push buttons

The standard button type in macOS is known as a push button. You can configure a push button to display text, a symbol, an icon, or an image, or a combination of text and image content. Push buttons can act as the default button in a view and you can tint them.

Use a flexible-height push button only when you need to display tall or variable height content. Flexible-height buttons support the same configurations as regular push buttons — and they use the same corner radius and content padding — so they look consistent with other buttons in your interface. If you need to present a button that contains two lines of text or a tall icon, use a flexible-height button; otherwise, use a standard push button. For developer guidance, see .

Append a trailing ellipsis to the title when a push button opens another window, view, or app. Throughout the system, an ellipsis in a control title signals that people can provide additional input. For example, the Edit buttons in the AutoFill pane of Safari Settings include ellipses because they open other views that let people modify autofill values.

Consider supporting spring loading. On systems with a Magic Trackpad, spring loading lets people activate a button by dragging selected items over it and force clicking — that is, pressing harder — without dropping the selected items. After force clicking, people can continue dragging the items, possibly to perform additional actions.


##### Square buttons

A square button (also known as a gradient button) initiates an action related to a view, like adding or removing rows in a table.

Square buttons contain symbols or icons — not text — and you can configure them to behave like push buttons, toggles, or pop-up buttons. The buttons appear in close proximity to their associated view — usually within or beneath it — so people know which view the buttons affect.

Use square buttons in a view, not in the window frame. Square buttons aren’t intended for use in toolbars or status bars. If you need a button in a , use a toolbar item.

Prefer using a symbol in a square button.  provides a wide range of symbols that automatically receive appropriate coloring in their default state and in response to user interaction.

Avoid using labels to introduce square buttons. Because square buttons are closely connected with a specific view, their purpose is generally clear without the need for descriptive text.

For developer guidance, see .


##### Help buttons

A help button appears within a view and opens app-specific help documentation.

Help buttons are circular, consistently sized buttons that contain a question mark. For guidance on creating help documentation, see .

Use the system-provided help button to display your help documentation. People are familiar with the appearance of the standard help button and know that choosing it opens help content.

When possible, open the help topic that’s related to the current context. For example, the help button in the Rules pane of Mail settings opens the Mail User Guide to a help topic that explains how to change these settings. If no specific help topic applies directly to the current context, open the top level of your app’s help documentation when people choose a help button.

Include no more than one help button per window. Multiple help buttons in the same context make it hard for people to predict the result of clicking one.

Position help buttons where people expect to find them. Use the following locations for guidance.

Use a help button within a view, not in the window frame. For example, avoid placing a help button in a toolbar or status bar.

Avoid displaying text that introduces a help button. People know what a help button does, so they don’t need additional descriptive text.


##### Image buttons

An image button appears in a view and displays an image, symbol, or icon. You can configure an image button to behave like a push button, toggle, or pop-up button.

Use an image button in a view, not in the window frame. For example, avoid placing an image button in a toolbar or status bar. If you need to use an image as a button in a toolbar, use a toolbar item. See .

Include about 10 pixels of padding between the edges of the image and the button edges. An image button’s edges define its clickable area even when they aren’t visible. Including padding ensures that a click registers correctly even if it’s not precisely within the image. In general, avoid including a system-provided border in an image button; for developer guidance, see .

If you need to include a label, position it below the image button. For related guidance, see .


#### visionOS

A visionOS button typically includes a visible background that can help people see it, and the button plays sound to provide feedback when people interact with it.

There are three standard button shapes in visionOS. Typically, an icon-only button uses a  shape, a text-only button uses a  or  shape, and a button that includes both an icon and text uses the capsule shape.

visionOS buttons use different visual styles to communicate four different interaction states.

> [NOTE] In visionOS, buttons don’t support custom hover effects.

In addition to the four states shown above, a button can also reveal a tooltip when people look at it for a brief time. In general, buttons that contain text don’t need to display a tooltip because the button’s descriptive label communicates what it does.

In visionOS, buttons can have the following sizes.

Prefer buttons that have a discernible background shape and fill. It tends to be easier for people to see a button when it’s enclosed in a shape that uses a contrasting background fill. The exception is a button in a toolbar, context menu, alert, or  where the shape and material of the larger component make the button comfortably visible. The following guidelines can help you ensure that a button looks good in different contexts:

- When a button appears on top of a glass , use the  material as the button’s background.

- When a button appears floating in space, use the  for its background.

Avoid creating a custom button that uses a white background fill and black text or icons. The system reserves this visual style to convey the toggled state.

In general, prefer circular or capsule-shape buttons. People’s eyes tend to be drawn toward the corners in a shape, making it difficult to keep looking at the shape’s center. The more rounded a button’s shape, the easier it is for people to look steadily at it. When you need to display a button by itself, prefer a capsule-shape button.

Provide enough space around a button to make it easy for people to look at it. Aim to place buttons so their centers are always at least 60 pts apart. If your buttons measure 60 pts or larger, add 4 pts of padding around them to keep the hover effect from overlapping. Also, it’s usually best to avoid displaying small or mini buttons in a vertical stack or horizontal row.

Choose the right shape if you need to display text-labeled buttons in a stack or row. Specifically, prefer the rounded-rectangle shape in a vertical stack of buttons and prefer the capsule shape in a horizontal row of buttons.

Use standard controls to take advantage of the audible feedback sounds people already know. Audible feedback is especially important in visionOS, because the system doesn’t play haptics.


#### watchOS

watchOS displays all inline buttons using the  button shape. When you place a button inline with content, it gains a material effect that contrasts with the background to ensure legibility.

Use a toolbar to place buttons in the corners. The system automatically moves the time and title to accommodate toolbar buttons. The system also applies the  appearance to toolbar buttons, providing a clear visual distinction from the content beneath them.

Prefer buttons that span the width of the screen for primary actions in your app. Full-width buttons look better and are easier for people to tap. If two buttons must share the same horizontal space, use the same height for both, and use images or short text titles for each button’s content.

Use toolbar buttons to provide either navigation to related areas or contextual actions for the view’s content. These buttons provide access to additional information or secondary actions for the view’s content.

Use the same height for vertical stacks of one- and two-line text buttons. As much as possible, use identical button heights for visual consistency.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Context menus

`/design/human-interface-guidelines/context-menus`

_A context menu provides access to functionality that’s directly related to an item, without cluttering the interface._

Although a context menu provides convenient access to frequently used items, it’s hidden by default, so people might not know it’s there. To reveal a context menu, people generally choose a view or select some content and then perform an action, using the input modes their current configuration supports. For example:

- The system-defined touch or pinch and hold gesture in visionOS, iOS, and iPadOS

- Pressing the Control key while clicking a pointing device in macOS and iPadOS

- Using a secondary click on a Magic Trackpad in macOS or iPadOS


### Best practices

Prioritize relevancy when choosing items to include in a context menu. A context menu isn’t for providing advanced or rarely used items; instead, it helps people quickly access the commands they’re most likely to need in their current context. For example, the context menu for a Mail message in the Inbox includes commands for replying and moving the message, but not commands for editing message content, managing mailboxes, or filtering messages.

Aim for a small number of menu items. A context menu that’s too long can be difficult to scan and scroll.

Support context menus consistently throughout your app. If you provide context menus for items in some places but not in others, people won’t know where they can use the feature and may think there’s a problem.

Always make context menu items available in the main interface, too. For example, in Mail in iOS and iPadOS, the context menu items that are available for a message in the Inbox are also available in the toolbar of the message view. In macOS, an app’s menu bar menus list all the app’s commands, including those in various context menus.

If you need to use submenus to manage a menu’s complexity, keep them to one level. A submenu is a menu item that reveals a secondary menu of logically related commands. Although submenus can shorten a context menu and clarify its commands, more than one level of submenu complicates the experience and can be difficult for people to navigate. If you need to include a submenu, give it an intuitive title that helps people predict its contents without opening it. For guidance, see .

Hide unavailable menu items, don’t dim them. Unlike a regular menu, which helps people discover actions they can perform even when the action isn’t available, a context menu displays only the actions that are relevant to the currently selected view or content. In macOS, the exceptions are the Cut, Copy, and Paste menu items, which may appear unavailable if they don’t apply to the current context.

Aim to place the most frequently used menu items where people are likely to encounter them first. When a context menu opens, people often read it starting from the part that’s closest to where their finger or pointer revealed it. Depending on the location of the selected content, a context menu might open above or below it, so you might also need to reverse the order of items to match the position of the menu.

Show keyboard shortcuts in your app’s main menus, not in context menus. Context menus already provide a shortcut to task-specific commands, so it’s redundant to display keyboard shortcuts too.

Follow best practices for using separators. As with other types of menus, you can use separators to group items in a context menu and help people scan the menu more quickly. In general, you don’t want more than about three groups in a context menu. For guidance, see .

In iOS, iPadOS, and visionOS, warn people about context menu items that can destroy data. If you need to include potentially destructive items in your context menu — such as Delete or Remove — list them at the end of the menu and identify them as destructive (for developer guidance, see ). The system can display a destructive menu item using a red text color.


### Content

A context menu seldom displays a title. In contrast, each item in a context menu needs to display a short label that clearly describes what it does. For guidance, see .

Include a title in a context menu only if doing so clarifies the menu’s effect. For example, when people select multiple Mail messages and tap the Mark toolbar button in iOS and iPadOS, the resulting context menu displays a title that states the number of selected messages, reminding people that the command they choose affects all the messages they selected.

Represent menu item actions with familiar icons. Icons help people recognize common actions throughout your app. Use the same icons as the system to represent actions such as Copy, Share, and Delete, wherever they appear. For a list of icons that represent common actions, see . For additional guidance, see .


### Platform considerations

No additional considerations for tvOS. Not supported in watchOS.


#### iOS, iPadOS

Provide either a context menu or an edit menu for an item, but not both. If you provide both features for the same item, it can be confusing to people — and difficult for the system to detect their intent. See .

In iPadOS, consider using a context menu to let people create a new object in your app. iPadOS lets you reveal a context menu when people perform a long press on the touchscreen or use a secondary click with an attached trackpad or keyboard. For example, Files lets people create a new folder by revealing a context menu in an area between existing files and folders.

In iOS and iPadOS, a context menu can display a preview of the current content near the list of commands. People can choose a command in the menu or — in some cases — they can tap the preview to open it or drag it to another area.

Prefer a graphical preview that clarifies the target of a context menu’s commands. For example, when people reveal a context menu on a list item in Notes or Mail, the preview shows a condensed version of the actual content to help people confirm that they’re working with the item they intend.

Ensure that your preview looks good as it animates. As people reveal a context menu on an onscreen object, the system animates the preview image as it emerges from the content, dimming the screen behind the preview and the menu. It’s important to adjust the preview’s clipping path to match the shape of the preview image so that its contours, such as the rounded corners, don’t appear to change during animation. For developer guidance, see .


#### macOS

On a Mac, a context menu is sometimes called a contextual menu.


#### visionOS

Consider using a context menu instead of a panel or inspector window to present frequently used functionality. Minimizing the number of separate views or windows your app opens can help people keep their space uncluttered.

In general, avoid letting a context menu’s height exceed the height of the window. In visionOS, a window includes system-provided components above and below its top and bottom edges, such as window-management controls and the Share menu, so a context menu that’s too tall could obscure them. As you consider the number of items to include, be guided by the ways people are likely to use your app. For example, people who use an app to accomplish in-depth, specialist tasks often expect to spend time learning a large number of sophisticated commands and might appreciate contextual access to them. On the other hand, people who use an app to perform a few simple actions may appreciate short contextual menus that are quick to scan and use.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Dock menus

`/design/human-interface-guidelines/dock-menus`

_On a Mac, people can secondary click an app’s or game’s icon in the Dock to reveal a Dock menu, which presents both system-provided and custom items._

The system-provided Dock menu items can vary depending on whether the app is open. For example, the Dock menu for Safari includes menu items for actions like viewing a current window or creating a new window.

> [NOTE] Although iOS and iPadOS don’t support a Dock menu, people can reveal a similar menu of system-provided and custom items — called Home Screen quick actions — when they long press an app icon on the Home Screen or in the Dock. For guidance, see .


### Best practices

As with all menus, you need to label Dock menu items succinctly and organize them logically. For guidance, see .

Make custom Dock menu items available in other places, too. Not everyone uses a Dock menu, so it’s important to offer the same commands elsewhere, like in your menu bar menus or within your interface.

Prefer high-value custom items for your Dock menu. For example, a Dock menu can list all currently or recently open windows, making it a convenient way to jump to the window people want. Also consider listing a few of the actions that are most likely to be useful when your app isn’t frontmost or when there are no open windows. For example, Mail includes items for getting new mail and composing a new message in addition to listing all open windows.


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

---

## Edit menus

`/design/human-interface-guidelines/edit-menus`

_An edit menu lets people make changes to selected content in the current view, in addition to offering related commands like Copy, Select, Translate, and Look Up._

In addition to text, an edit menu’s commands can apply to many types of selectable content, such as images, files, and objects like contact cards, charts, or map locations. In iOS, iPadOS, and visionOS, the system automatically detects the data type of a selected item, which can result in the addition of a related action to the edit menu. For example, selecting an address can add an  item like Get directions to the edit menu.

Edit menus can look and behave slightly differently in different platforms.

- In iOS, the edit menu displays commands in a compact, horizontal list that appears when people touch and hold or double-tap to select content in a view. People can tap a chevron on the trailing edge to expand it into a .

- In iPadOS, the edit menu looks different depending on how people reveal it. When people use touch interactions to reveal the menu, it uses the compact, horizontal appearance. In contrast, when people use a keyboard or pointing device to reveal it, the edit menu opens directly in a context menu.

- In macOS, people can access editing commands in a context menu they can reveal while in an editing task, as well as through the app’s  in the menu bar.

- In visionOS, people use the standard  gesture to open the edit menu as a horizontal bar, or they can open it in a context menu.

Editing content is rare in tvOS and watchOS experiences, so the system doesn’t provide an edit menu in these platforms.


### Best practices

Prefer the system-provided edit menu. People are familiar with the contents and behavior of the system-provided component, so creating a custom menu that presents the same commands is redundant and likely to be confusing. For a list of standard edit menu commands, see .

Let people reveal an edit menu using the system-defined interactions they already know. For example, people expect to touch and hold on a touchscreen, pinch and hold in visionOS, or use a secondary click with an attached trackpad or keyboard. Although the interactions to reveal an edit menu can differ based on platform, people don’t appreciate having to learn a custom interaction to perform a standard task.

Offer commands that are relevant in the current context, removing or dimming commands that don’t apply. For example, if nothing is selected, avoid showing options that require a selection, such as Copy or Cut. Similarly, avoid showing a Paste option when there’s nothing to paste.

List custom commands near relevant system-provided ones. For example, if you offer custom formatting commands, you can help maintain the ordering people expect by listing them after the system-provided commands in the format section. Avoid overwhelming people with too many custom commands.

When it makes sense, let people select and copy noneditable text. People appreciate being able to paste static content — such as an image caption or social media status — into a message, note, or web search. In general, let people copy content text, but not control labels.

Support undo and redo when possible. Like all menus, an edit menu doesn’t require confirmation before performing its actions, so people can easily use undo and redo to recover a previous state. For guidance, see .

In general, avoid implementing other controls that perform the same functions as edit menu items. People typically expect to choose familiar edit commands in an edit menu, or use standard keyboard shortcuts. Offering redundant controls can crowd your interface, giving you less space for presenting actions that people might not already know about.

Differentiate different types of deletion commands when necessary. For example, a Delete menu item behaves the same as pressing a Delete key, but a Cut menu item copies the selected content to the system pasteboard before deleting it.


### Content

Create short labels for custom commands. Use verbs or short verb phrases that succinctly describe the action your command performs. For guidance, see .


### Platform considerations

No additional considerations for visionOS. Not supported in tvOS or watchOS.


#### iOS, iPadOS

Ensure your edit menu works well in both styles. The system displays the compact, horizontal style when people use Multi-Touch gestures to reveal the edit menu, and the vertical style when people use a keyboard or pointing device to reveal it. For guidance using the vertical menu layout, see .

Adjust an edit menu’s placement, if necessary. Depending on available space, the default menu position is above or below the insertion point or selection. The system also displays a visual indicator that points to the targeted content. Although you can’t change the shape of the menu or its pointer, you can change the menu’s position. For example, you might need to move the menu to prevent it from covering important content or parts of your interface.


#### macOS

To learn about the order of items in a macOS app’s Edit menu, see .


### Resources


##### Related


##### Developer documentation

 — UIKit

 — AppKit


### Change log

---

## Home Screen quick actions

`/design/human-interface-guidelines/home-screen-quick-actions`

_Home Screen quick actions give people a way to perform app-specific actions from the Home Screen._

People can get a menu of available quick actions when they touch and hold an app icon (on a 3D Touch device, people can press on the icon with increased pressure to see the menu). For example, Mail includes quick actions that open the Inbox or the VIP mailbox, initiate a search, and create a new message. In addition to app-specific actions, a Home Screen quick action menu also lists items for removing the app and editing the Home Screen.

Each Home Screen quick action includes a title, an interface icon on the left or right (depending on your app’s position on the Home Screen), and an optional subtitle. The title and subtitle are always left-aligned in left-to-right languages. Your app can even dynamically update its quick actions when new information is available. For example, Messages provides quick actions for opening your most recent conversations.


### Best practices

Create quick actions for compelling, high-value tasks. For example, Maps lets people search near their current location or get directions home without first opening the Maps app. People tend to expect every app to provide at least one useful quick action; you can provide a total of four.

Avoid making unpredictable changes to quick actions. Dynamic quick actions are a great way to keep actions relevant. For example, it may make sense to update quick actions based on the current location or recent activities in your app, time of day, or changes in settings. Make sure that actions change in ways that people can predict.

For each quick action, provide a succinct title that instantly communicates the results of the action. For example, titles like “Directions Home,” “Create New Contact,” and “New Message” can help people understand what happens when they choose the action. If you need to give more context, provide a subtitle too. Mail uses subtitles to indicate whether there are unread messages in the Inbox and VIP folder. Don’t include your app name or any extraneous information in the title or subtitle, keep the text short to avoid truncation, and take localization into account as you write the text.

Provide a familiar interface icon for each quick action. Prefer using  to represent actions. For a list of icons that represent common actions, see ; for additional guidance, see .

If you design your own interface icon, use the Quick Action Icon Template that’s included with .

Don’t use an emoji in place of a symbol or interface icon. Emojis are full color, whereas quick action symbols are monochromatic and change appearance in Dark Mode to maintain contrast.


### Platform considerations

No additional considerations for iOS or iPadOS. Not supported in macOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — UIKit

---

## Menus

`/design/human-interface-guidelines/menus`

_A menu reveals its options when people interact with it, making it a space-efficient way to present commands in your app or game._

Menus are ubiquitous in apps and games, so most people already know how to use them. Whether you use system-provided components or custom ones, people expect menus to behave in familiar ways. For example, people understand that opening a menu reveals one or more menu items, each of which represents a command, option, or state that affects the current selection or context. The guidance for labeling and organizing menu items applies to all types of menus in all experiences.

> [NOTE] Several system-provided components also include menus that support specific use cases. For example, a  or  can reveal a menu of options directly related to its action; a  lets people access a small number of frequently used actions relevant to their current view or task; and in macOS and iPadOS,  menus contain all the commands people can perform in the app or game.


### Labels

A menu item’s label describes what it does and may include a symbol if it helps to clarify meaning. In an app, a menu item can also display the associated keyboard command, if there is one; in a game, a menu item rarely displays a keyboard command because a game typically needs to handle input from a wider range of devices and may offer game-specific mappings for various keys.

> [NOTE] Depending on menu layout, an iOS, iPadOS, or visionOS app can display a few unlabeled menu items that use only symbols or icons to identify them. For guidance, see  and .

For each menu item, write a label that clearly and succinctly describes it. In general, label a menu item that initiates an action using a verb or verb phrase that describes the action, such as View, Close, or Select. For guidance labeling menu items that show and hide something in the interface or show the currently selected state of something, see . As with all the copy you write, let your app’s or game’s communication style guide the tone of the menu-item labels you create.

To be consistent with platform experiences, use title-style capitalization. Although a game might have a different writing style, generally prefer using title-style capitalization, which capitalizes every word except articles, coordinating conjunctions, and short prepositions, and capitalizes the last word in the label, regardless of the part of speech. For complete guidance on this style of capitalization in English, see .

Remove articles like a, an, and the from menu-item labels to save space. In English, articles always lengthen labels, but rarely enhance understanding. For example, changing a menu-item label from  View Settings to View the Settings doesn’t provide additional clarification.

Show people when a menu item is unavailable. An unavailable menu item often appears dimmed and doesn’t respond to interactions. If all of a menu’s items are unavailable, the menu itself needs to remain available so people can open it and learn about the commands it contains.

Append an ellipsis to a menu item’s label when the action requires more information before it can complete. The ellipsis character (…) signals that people need to input information or make additional choices, typically within another view.


### Icons

Represent common actions consistently. The system provides standard icons to represent common actions like Share, Print, and Search. Using standard icons makes your app easier to use and more familiar. For a list of icons that represent common actions, see .

Use menu item icons sparingly and with purpose. Icons allow people to find menu items more quickly, and help clarify what selecting an item does. Use an icon to highlight the most common actions and key features of your app, file system locations, connected devices, visual concepts like rotating or flipping an image, and user-generated content like folders and documents. Don’t display an icon if you can’t find one that clearly represents the menu item.

Apply a uniform visual treatment across menu items in the same group. For visual consistency and balance, provide icons for all menu items in a group, or none of them.


### Organization

Organizing menu items in ways that reflect how people use your app or game can make your experience feel straightforward and easy to use.

Prefer listing important or frequently used menu items first. People tend to start scanning a menu from the top, so listing high-priority items first often means that people can find what they want without reading the entire menu.

Consider grouping logically related items. For example, grouping editing commands like Copy, Cut, and Paste or camera commands like Look Up, Look Down, and Look Left can help people remember where to find them. To help people visually distinguish such groups, use a separator. Depending on the platform and type of menu, a separator appears between groups of items as a horizontal line or a short gap in the menu’s background appearance.

Prefer keeping all logically related commands in the same group, even if the commands don’t all have the same importance. For example, people generally use Paste and Match Style much less often than they use Paste, but they expect to find both commands in the same group that contains more frequently used editing commands like Copy and Cut.

Be mindful of menu length. People need more time and attention to read a long menu, which means they may miss the command they want. If a menu is too long, consider dividing it into separate menus. Alternatively, you might be able to use a submenu to shorten the list, such as listing difficulty levels in a submenu of a New Game menu item. The exception is when a menu contains user-defined or dynamically generated content, like the History and Bookmarks menus in Safari. People expect such a menu to accommodate all the items they add to it, so a long menu is fine, and scrolling is acceptable.


### Submenus

Sometimes, a menu item can reveal a set of closely related items in a subordinate list called a submenu. A menu item indicates the presence of a submenu by displaying a symbol — like a chevron — after its label. Submenus are functionally identical to menus, aside from their hierarchical positioning.

Use submenus sparingly. Each submenu adds complexity to the interface and hides the items it contains. You might consider creating a submenu when a term appears in more than two menu items in the same group. For example, instead of offering separate menu items for Sort by Date, Sort by Score, and Sort by Time, a game could present a menu item that uses a submenu to list the sorting options Date, Score, and Time. It generally works well to use the repeated term — in this case, Sort by — in the menu item’s label to help people predict the contents of the submenu.

Limit the depth and length of submenus. It can be difficult for people to reveal multiple levels of hierarchical submenus, so it’s generally best to restrict them to a single level. Also, if a submenu contains more than about five items, consider creating a new menu.

Make sure a submenu remains available even when its nested menu items are unavailable. A submenu item — like all menu items — needs to let people open it and learn about the commands it contains.

Prefer using a submenu to indenting menu items. Using indentation is inconsistent with the system and doesn’t clearly express the relationships between the menu items.


### Toggled items

Menu items often represent attributes or objects that people can turn on or off. If you want to avoid listing a separate menu item for each state, it can be efficient to create a single, toggled menu item that communicates the current state and lets people change it.

Consider using a changeable label that describes an item’s current state. For example, instead of listing two menu items like Show Map and Hide Map, you could include one menu item whose label changes from Show Map to Hide Map, depending on whether the map is visible.

Include a verb if a changeable label isn’t clear enough. For example, people might not know whether the changeable labels HDR On and HDR Off describe actions or states. If you needed to clarify that these items represent actions, you could add verbs to the labels, like Turn HDR On and Turn HDR Off.

If necessary, display both menu items instead of one toggled item. Sometimes, it helps people to view both actions or states at the same time. For example, a game could list both Take Account Online and Take Account Offline items, so when someone’s account is online, only the Take Account Offline menu item appears available.

Consider using a checkmark to show that an attribute is currently in effect. It’s easy for people to scan for checkmarks in a list of attributes to find the ones that are selected. For example, in the standard Format > Font menu, checkmarks can make it easy for people notice the styles that apply to selected text.

Consider offering a menu item that makes it easy to remove multiple toggled attributes. For example, if you let people apply several styles to selected text, it can work well to provide a menu item — such as Plain — that removes all applied formatting attributes at one time.


### In-game menus

In-game menus give players ways to control gameplay as well as determine  for the game as a whole.

Let players navigate in-game menus using the platform’s default interaction method. People expect to use the same interactions to navigate your menus as they use for navigating other menus on the device. For example, players expect to navigate your game menus using touch in iOS and iPadOS, and direct and indirect gestures in visionOS.

Make sure your menus remain easy to open and read on all platforms you support. Each platform defines specific sizes that work best for fonts and interaction targets. Sometimes, scaling your game content to display on a different screen — especially a mobile device screen — can make in-game menus too small for people to read or interact with. If this happens, modify the size of the tap targets and consider alternative ways to communicate the menu’s content. For guidance, see  and .


### Platform considerations

No additional considerations for macOS, tvOS, or watchOS.


#### iOS, iPadOS

In iOS and iPadOS, a menu can display items in one of the following three layouts.

- Small. A row of four items appears at the top of the menu, above a list that contains the remaining items. For each item in the top row, the menu displays a symbol or icon, but no label.

- Medium. A row of three items appears at the top of the menu, above a list that contains the remaining items. For each item in the top row, the menu displays a symbol or icon above a short label.

- Large (the default). The menu displays all items in a list.

For developer guidance, see .

Choose a small or medium menu layout when it can help streamline people’s choices. Consider using the medium layout if your app has three important actions that people often want to perform. For example, Notes uses the medium layout to give people a quick way to perform the Scan, Lock, and Pin actions. Use the small layout only for closely related actions that typically appear as a group, such as Bold, Italic, Underline, and Strikethrough. For each action, use a recognizable symbol that helps people identify the action without a label.


#### visionOS

In visionOS, a menu can display items using the small or large layout styles that iOS and iPadOS define (for guidance, see ). You can present a menu in your app or game from 3D content using a SwiftUI view. To ensure that your menu is always visible to people, even when other content occludes it, you can apply a . As in macOS, an open menu in a visionOS window can appear outside of the window’s boundaries.

Prefer displaying a menu near the content it controls. Because people need to look at a menu item before tapping it, they might miss the item’s effect if the content it controls is too far away.

Prefer the subtle breakthrough effect in most cases. This effect blends the presentation with its surrounding content, to maintain legibility and usability while preserving the depth and context of the scene. When you select  for the breakthrough effect of a menu that overlaps with 3D content, the system applies  by default. You can use  if it’s important to display a menu prominently over the entire scene in your app or game, but this can disrupt the experience for people and potentially cause discomfort. Alternatively, you can use  to fully occlude your menu behind other 3D content — for example, in a puzzle game that requires people to navigate around barriers — but this may make it difficult for people to see and access the menu.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Ornaments

`/design/human-interface-guidelines/ornaments`

_In visionOS, an ornament presents controls and information related to a window, without crowding or obscuring the window’s contents._

An ornament floats in a plane that’s parallel to its associated window and slightly in front of it along the z-axis. If the associated window moves, the ornament moves with it, maintaining its relative position; if the window’s contents scroll, the controls or information in the ornament remain unchanged.

Ornaments can appear on any edge of a window and can contain UI components like buttons, segmented controls, and other views. The system uses ornaments to create and manage components like , , and video playback controls; you can use an ornament to create a custom component.


### Best practices

Consider using an ornament to present frequently needed controls or information in a consistent location that doesn’t clutter the window. Because an ornament stays close to its window, people always know where to find it. For example, Music uses an ornament to offer Now Playing controls, ensuring that these controls remain in a predictable location that’s easy to find.

In general, keep an ornament visible. It can make sense to hide an ornament when people dive into a window’s content — for example, when they watch a video or view a photo — but in most cases, people appreciate having consistent access to an ornament’s controls.

If you need to display multiple ornaments, prioritize the overall visual balance of the window. Ornaments help elevate important actions, but they can sometimes distract from your content. When necessary, consider constraining the total number of ornaments to avoid increasing a window’s visual weight and making your app feel more complicated. If you decide to remove an ornament, you can relocate its elements into the main window.

Aim to keep an ornament’s width the same or narrower than the width of the associated window. If an ornament is wider than its window, it can interfere with a tab bar or other vertical content on the window’s side.

Consider using borderless buttons in an ornament. By default, an ornament’s background is , so if you place a button directly on the background, it may not need a visible border. When people look at a borderless button in an ornament, the system automatically applies the hover effect to it (for guidance, see ).

Use system-provided toolbars and tab bars unless you need to create custom components. In visionOS, toolbars and tab bars automatically appear as ornaments, so you don’t need to use an ornament to create these components. For developer guidance, see  and .


### Platform considerations

Not supported in iOS, iPadOS, macOS, tvOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — SwiftUI


##### Videos


### Change log

---

## Pop-up buttons

`/design/human-interface-guidelines/pop-up-buttons`

_A pop-up button displays a menu of mutually exclusive options._

After people choose an item from a pop-up button’s menu, the menu closes, and the button can update its content to indicate the current selection.


### Best practices

Use a pop-up button to present a flat list of mutually exclusive options or states. A pop-up button helps people make a choice that affects their content or the surrounding view. Use a  instead if you need to:

- Offer a list of actions

- Let people select multiple items

- Include a submenu

Provide a useful default selection. A pop-up button can update its content to identify the current selection, but if people haven’t made a selection yet, it shows the default item you specify. When possible, make the default selection an item that most people are likely to want.

Give people a way to predict a pop-up button’s options without opening it. For example, you can use an introductory label or a button label that describes the button’s effect, giving context to the options.

Consider using a pop-up button when space is limited and you don’t need to display all options all the time. Pop-up buttons are a space-efficient way to present a wide array of choices.

If necessary, include a Custom option in a pop-up button’s menu to provide additional items that are useful in some situations. Offering a Custom option can help you avoid cluttering the interface with items or controls that people need only occasionally. You can also display explanatory text below the list to help people understand how the options work.


### Platform considerations

No additional considerations for iOS, macOS, or visionOS. Not supported in tvOS or watchOS.


#### iPadOS

Within a popover or modal view, consider using a pop-up button instead of a disclosure indicator to present multiple options for a list item. For example, people can quickly choose an option from the pop-up button’s menu without navigating to a detail view. Consider using a pop-up button in this scenario when you have a fairly small, well-defined set of options that work well in a menu.


### Resources


##### Related


##### Developer documentation

  — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Pull-down buttons

`/design/human-interface-guidelines/pull-down-buttons`

_A pull-down button displays a menu of items or actions that directly relate to the button’s purpose._

After people choose an item in a pull-down button’s menu, the menu closes, and the app performs the chosen action.


### Best practices

Use a pull-down button to present commands or items that are directly related to the button’s action. The menu lets you help people clarify the button’s target or customize its behavior without requiring additional buttons in your interface. For example:

- An Add button could present a menu that lets people specify the item they want to add.

- A Sort button could use a menu to let people select an attribute on which to sort.

- A Back button could let people choose a specific location to revisit instead of opening the previous one.

If you need to provide a list of mutually exclusive choices that aren’t commands, use a  instead.

Avoid putting all of a view’s actions in one pull-down button. A view’s primary actions need to be easily discoverable, so you don’t want to hide them in a pull-down button that people have to open before they can do anything.

Balance menu length with ease of use. Because people have to interact with a pull-down button before they can view its menu, listing a minimum of three items can help the interaction feel worthwhile. If you need to list only one or two items, consider using alternative components to present them, such as buttons to perform actions and toggles or switches to present selections. In contrast, listing too many items in a pull-down button’s menu can slow people down because it takes longer to find a specific item.

Display a succinct menu title only if it adds meaning. In general, a pull-down button’s content — combined with descriptive menu items — provides all the context people need, making a menu title unnecessary.

Let people know when a pull-down button’s menu item is destructive, and ask them to confirm their intent. Menus use red text to highlight actions that you identify as potentially destructive. When people choose a destructive action, the system displays an  (iOS) or  (iPadOS) in which they can confirm their choice or cancel the action. Because an action sheet appears in a different location from the menu and requires deliberate dismissal, it can help people avoid losing data by mistake.

Include an interface icon with a menu item when it provides value. If you need to clarify an item’s meaning, you can display an  or image after its label. Using  for this purpose can help you provide a familiar experience while ensuring that the symbol remains aligned with the text at every scale.


### Platform considerations

No additional considerations for macOS or visionOS. Not supported in tvOS or watchOS.


#### iOS, iPadOS

> [NOTE] You can also let people reveal a pull-down menu by performing a specific gesture on a button. For example, in iOS 14 and later, Safari responds to a touch and hold gesture on the Tabs button by displaying a menu of tab-related actions, like New Tab and Close All Tabs.

Consider using a More pull-down button to present items that don’t need prominent positions in the main interface. A More button can help you offer a range of items where space is constrained, but it can also hinder discoverability. Although people generally understand that a More button offers additional functionality related to the current context, the ellipsis icon doesn’t necessarily help them predict its contents. To design an effective More button, weigh the convenience of its size against its impact on discoverability to find a balance that works in your app.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## The menu bar

`/design/human-interface-guidelines/the-menu-bar`

_On a Mac or an iPad, the menu bar at the top of the screen displays the top-level menus in your app or game._

Mac users are very familiar with the macOS menu bar, and they rely on it to help them learn what an app does and find the commands they need. To help your app or game feel at home in macOS, it’s essential to provide a consistent menu bar experience.

Menu bar menus on iPad are similar to those on Mac, appearing in the same order and with familiar sets of menu items. When you adopt the menu structure that people expect from their experience on Mac, it helps them immediately understand and take advantage of the menu bar on iPad as well.

Keyboard shortcuts in iPadOS use the same patterns as in macOS. For guidance, see .

Menus in the menu bar share most of the appearance and behavior characteristics that all menu types have. To learn about menus in general — and how to organize and label menu items — see .


### Anatomy

When present in the menu bar, the following menus appear in the order listed below.

- YourAppName (you supply a short version of your app’s name for this menu’s title)

- File

- Edit

- Format

- View

- App-specific menus, if any

- Window

- Help

In addition, the macOS menu bar includes the Apple menu on the leading side and menu bar extras on the trailing side. See  for guidance.


### Best practices

Support the default system-defined menus and their ordering. People expect to find menus and menu items in an order they’re familiar with. In many cases, the system implements the functionality of standard menu items so you don’t have to. For example, when people select text in a standard text field, the system makes the Edit > Copy menu item available.

Always show the same set of menu items. Keeping menu items visible helps people learn what actions your app supports, even if they’re unavailable in the current context. If a menu bar item isn’t actionable, disable the action instead of hiding it from the menu.

Represent menu item actions with familiar icons. Icons help people recognize common actions throughout your app. Use the same icons as the system to represent actions such as Copy, Share, and Delete, wherever they appear. For a list of icons that represent common actions, see . For additional guidance, see .

Support the keyboard shortcuts defined for the standard menu items you include. People expect to use the keyboard shortcuts they already know for standard menu items, like Copy, Cut, Paste, Save, and Print. Define custom keyboard shortcuts only when necessary. For guidance, see .

Prefer short, one-word menu titles. Various factors — like different display sizes and the presence of menu bar extras — can affect the spacing and appearance of your menus. One-word menu titles work especially well in the menu bar because they take little space and are easy for people to scan. If you need to use more than one word in the menu title, use title-style capitalization.


### App menu

The app menu lists items that apply to your app or game as a whole, rather than to a specific task, document, or window. To help people quickly identify the active app, the menu bar displays your app name in bold.

The app menu typically contains the following menu items listed in the following order.

Display the About menu item first. Include a separator after the About menu item so that it appears by itself in a group.


### File menu

The File menu contains commands that help people manage the files or documents an app supports. If your app doesn’t handle any types of files, you can rename or eliminate this menu.

The File menu typically contains the following menu items listed in the following order.


### Edit menu

The Edit menu lets people make changes to content in the current document or text container, and provides commands for interacting with the Clipboard. Because many editing commands apply to any editable content, the Edit menu is useful even in apps that aren’t document-based.

Determine whether Find menu items belong in the Edit menu. For example, if your app lets people search for files or other types of objects, Find menu items might be more appropriate in the File menu.

The Edit menu typically contains the following top-level menu items, listed in the following order.


### Format menu

The Format menu lets people adjust text formatting attributes in the current document or text container. You can exclude this menu if your app doesn’t support formatted text editing.

The Format menu typically contains the following top-level menu items, listed in the following order.


### View menu

The View menu lets people customize the appearance of all an app’s windows, regardless of type.

> [IMPORTANT] The View menu doesn’t include items for navigating between or managing specific windows; the  provides these commands.

Provide a View menu even if your app supports only a subset of the standard view functions. For example, if your app doesn’t include a tab bar, toolbar, or sidebar, but does support full-screen mode, provide a View menu that includes only the Enter/Exit Full Screen menu item.

Ensure that each show/hide item title reflects the current state of the corresponding view. For example, when the toolbar is hidden, provide a Show Toolbar menu item; when the toolbar is visible, provide a Hide Toolbar menu item.

The View menu typically contains the following top-level menu items, listed in the following order.


### App-specific menus

Your app’s custom menus appear in the menu bar between the View menu and the Window menu. For example, Safari’s menu bar includes app-specific History and Bookmarks menus.

Provide app-specific menus for custom commands. People look in the menu bar when searching for app-specific commands, especially when using an app for the first time. Even when commands are available elsewhere in your app, it’s important to list them in the menu bar. Putting commands in the menu bar makes them easier for people to find, lets you assign keyboard shortcuts to them, and makes them more accessible to people using Full Keyboard Access. Excluding commands from the menu bar — even infrequently used or advanced commands — risks making them difficult for everyone to find.

As much as possible, reflect your app’s hierarchy in app-specific menus. For example, Mail lists the Mailbox, Message, and Format menus in an order that mirrors the relationships of these items: mailboxes contain messages, and messages contain formatting.

Aim to list app-specific menus in order from most to least general or commonly used. People tend to expect menus in the leading end of a list to be more specialized than menus in the trailing end.


### Window menu

The Window menu lets people navigate, organize, and manage an app’s windows.

> [IMPORTANT] The Window menu doesn’t help people customize the appearance of windows or close them. To customize a window, people use commands in the ; to close a window, people choose Close in the .

Provide a Window menu even if your app has only one window. Include the Minimize and Zoom menu items so people using Full Keyboard Access can use the keyboard to invoke these functions.

Consider including menu items for showing and hiding panels. A  provides information, configuration options, or tools for interacting with content in a primary window, and typically appears only when people need it. There’s no need to provide access to the font panel or text color panel because the Format menu lists these panels.

The Window menu typically contains the following top-level menu items, listed in the following order.


### Help menu

The Help menu — located at the trailing end of the menu bar — provides access to an app’s help documentation. When you use the Help Book format for this documentation, macOS automatically includes a search field at the top of the Help menu.

For guidance, see ; for developer guidance, see .


### Dynamic menu items

In rare cases, it can make sense to present a dynamic menu item, which is a menu item that changes its behavior when people choose it while pressing a modifier key (Control, Option, Shift, or Command). For example, the Minimize item in the Window menu changes to Minimize All when people press the Option key.

Avoid making a dynamic menu item the only way to accomplish a task. Dynamic menu items are hidden by default, so they’re best suited to offer shortcuts to advanced actions that people can accomplish in other ways. For example, if someone hasn’t discovered the Minimize All dynamic menu item in the Window menu, they can still minimize each open window.

Use dynamic menu items primarily in menu bar menus. Adding a dynamic menu item to contextual or Dock menus can make the item even harder for people to discover.

Require only a single modifier key to reveal a dynamic menu item. It can be physically awkward to press more than one key while simultaneously opening a menu and choosing a menu item, in addition to reducing the discoverability of the dynamic behavior. For developer guidance, see .

> [TIP] macOS automatically sets the width of a menu to hold the widest item, including dynamic menu items.


### Platform considerations

Not supported in iOS, tvOS, visionOS, or watchOS.


#### iPadOS

The menu bar displays the top-level menus for your app or game, including both system-provided menus and any custom ones you choose to add. People reveal the menu bar by moving the pointer to the top edge of the screen, or swiping down from it. When visible, the menu bar occupies the same vertical space as the  at the top edge of the screen.

As with the macOS menu bar, the iPadOS menu bar provides a familiar way for people to learn what an app does, find the commands they need, and discover keyboard shortcuts.  While they are similar in most respects, there are a few key differences between the menu bars on each platform.

Because the menu bar is often hidden when running an app full screen, ensure that people can access all of your app’s functions through its UI.  In particular, always offer other ways to accomplish tasks assigned to dynamic menu items, since these are only available when a hardware keyboard is connected. Avoid using the menu bar as a catch-all location for functionality that doesn’t fit in elsewhere.

Reserve the YourAppName > Settings menu item for opening your app’s page in iPadOS Settings. If your app includes its own internal preferences area, link to it with a separate menu item beneath Settings in the same group. Place any other custom app-wide configuration options in this section as well.

For apps with tab-style navigation, consider adding each tab as a menu item in the View menu. Since each tab is a different view of the app, the View menu is a natural place to offer an additional way to navigate between tabs. If you do this, consider assigning key bindings to each tab to make navigation even more convenient.

Consider grouping menu items into submenus to conserve vertical space. Menu item rows on iPad use more space than on Mac to make them easier to tap. Because of this, and the smaller screen sizes of some iPads, it can be helpful to group related items into submenus more frequently than in the menu bar on Mac.


#### macOS

The menu bar in macOS includes the Apple menu, which is always the first item on the leading side of the menu bar. The Apple menu includes system-defined menu items that are always available, and you can’t modify or remove it. Space permitting, the system can also display menu bar extras in the trailing end of the menu bar. For guidance, see .

When menu bar space is constrained, the system prioritizes the display of menus and essential menu bar extras. To ensure that menus remain readable, the system may decrease the space between the titles, truncating them if necessary.

When people enter full-screen mode, the menu bar typically hides until they reveal it by moving the pointer to the top of the screen. For guidance, see .


##### Menu bar extras

A menu bar extra exposes app-specific functionality using an icon that appears in the menu bar when your app is running, even when it’s not the frontmost app. Menu bar extras are on the opposite side of the menu bar from your app’s menus. For developer guidance, see .

When necessary, the system hides menu bar extras to make room for app menus. Similarly, if there are too many menu bar extras, the system may hide some to avoid crowding app menus.

Consider using a symbol to represent your menu bar extra. You can create an  or you can choose one of the , using it as-is or customizing it to suit your needs. Both interface icons and symbols use black and clear colors to define their shapes; the system can apply other colors to the black areas in each image so it looks good on both dark and light menu bars, and when your menu bar extra is selected. The menu bar’s height is 24 pt.

Display a menu — not a popover — when people click your menu bar extra. Unless the app functionality you want to expose is too complex for a menu, avoid presenting it in a .

Let people — not your app — decide whether to put your menu bar extra in the menu bar. Typically, people add a menu bar extra to the menu bar by changing a setting in an app’s settings window. To ensure discoverability, however, consider giving people the option of doing so during setup.

Avoid relying on the presence of menu bar extras. The system hides and shows menu bar extras regularly, and you can’t be sure which other menu bar extras people have chosen to display or predict the location of your menu bar extra.

Consider exposing app-specific functionality in other ways, too. For example, you can provide a  that appears when people Control-click your app’s Dock icon. People can hide or choose not to use your menu bar extra, but a Dock menu is aways available when your app is running.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Toolbars

`/design/human-interface-guidelines/toolbars`

_A toolbar provides convenient access to frequently used commands, controls, navigation, and search._

A toolbar consists of one or more sets of controls arranged horizontally along the top or bottom edge of the view, grouped into logical sections.

Toolbars act on content in the view, facilitate navigation, and help orient people in the app. They include three types of content:

- The title of the current view

- Navigation controls, like back and forward, and 

- Actions, or bar items, like  and 

In contrast to a toolbar, a  is specifically for navigating between areas of an app.


### Best practices

Choose items deliberately to avoid overcrowding. People need to be able to distinguish and activate each item, so you don’t want to put too many items in the toolbar. To accommodate variable view widths, define which items move to the overflow menu as the toolbar becomes narrower.

> [NOTE] The system automatically adds an overflow menu in macOS or iPadOS when items no longer fit. Don’t add an overflow menu manually, and avoid layouts that cause toolbar items to overflow by default.

Add a More menu to contain additional actions. Prioritize less important actions for inclusion in the More menu. Try to include all actions in the toolbar if possible, and only add this menu if you really need it.

In iPadOS and macOS apps, consider letting people customize the toolbar to include their most common items. Toolbar customization is especially useful in apps that provide a lot of items — or that include advanced functionality that not everyone needs — and in apps that people tend to use for long periods of time. For example, it works well to make a range of editing actions available for toolbar customization, because people often use different types of editing commands based on their work style and their current project.

Reduce the use of toolbar backgrounds and tinted controls. Any custom backgrounds and appearances you use might overlay or interfere with background effects that the system provides. Instead, use the content layer to inform the color and appearance of the toolbar, and use a  when necessary to distinguish the toolbar area from the content area. This approach helps your app express its unique personality without distracting from content.

Avoid applying a similar color to toolbar item labels and content layer backgrounds. If your app already has bright, colorful content in the content layer, prefer using the default monochromatic appearance of toolbars. For more guidance, see .

Prefer using standard components in a toolbar. By default, standard buttons, text fields, headers, and footers have corner radii that are concentric with bar corners. If you need to create a custom component, ensure that its corner radius is also concentric with the bar’s corners.

Consider temporarily hiding toolbars for a distraction-free experience. Sometimes people appreciate a minimal interface to reduce distractions or reveal more content. If you support this, do so contextually when it makes the most sense, and offer ways to reliably restore hidden interface elements. For guidance, see . For guidance specific to visionOS, see .


### Titles

Provide a useful title for each window. A title helps people confirm their location as they navigate your app, and differentiates between the content of multiple open windows. If titling a toolbar seems redundant, you can leave the title area empty. For example, Notes doesn’t title the current note when a single window is open, because the first line of content typically supplies sufficient context. However, when opening notes in separate windows, the system titles them with the first line of content so people can tell them apart.

Don’t title windows with your app name. Your app’s name doesn’t provide useful information about your content hierarchy or any window or area in your app, so it doesn’t work well as a title.

Write a concise title. Aim for a word or short phrase that distills the purpose of the window or view, and keep the title under 15 characters long so you leave enough room for other controls.


### Navigation

A toolbar with navigation controls appears at the top of a window, helping people move through a hierarchy of content. A toolbar also often contains a  for quick navigation between areas or pieces of content. In iOS, a navigation-specific toolbar is sometimes called a navigation bar.

Use the standard Back and Close buttons. People know that the standard Back button lets them retrace their steps through a hierarchy of information, and the standard Close button closes a modal view. Prefer the standard symbols for each, and don’t use a text label that says Back or Close. If you create a custom version of either, make sure it still looks the same, behaves as people expect, and matches the rest of your interface, and ensure you consistently implement it throughout your app or game. For guidance, see .


### Actions

Provide actions that support the main tasks people perform. In general, prioritize the commands that people are most likely to want. These commands are often the ones people use most frequently, but in some apps it might make sense to prioritize commands that map to the highest level or most important objects people work with.

Make sure the meaning of each control is clear. Don’t make people guess or experiment to figure out what a toolbar item does. Prefer simple, recognizable symbols for items instead of text, except for actions like edit that aren’t well-represented by symbols. For guidance on symbols that represent common actions, see .

Prefer system-provided symbols without borders. System-provided symbols are familiar, automatically receive appropriate coloring and vibrancy, and respond consistently to user interactions. Borders (like outlined circle symbols) aren’t necessary because the section provides a visible container, and the system defines hover and selection state appearances automatically. For guidance, see .

Use the `.prominent` style for key actions such as Done or Submit. This separates and tints the action so there’s a clear focal point. Only specify one primary action, and put it on the trailing side of the toolbar.


### Item groupings

You can position toolbar items in three locations: the leading edge, center area, and trailing edge of the toolbar. These areas provide familiar homes for navigation controls, window or document titles, common actions, and search.

- Leading edge. Elements that let people return to the previous document and show or hide a sidebar appear at the far leading edge, followed by the view title. Next to the title, the toolbar can include a document menu that contains standard and app-specific commands that affect the document as a whole, such as Duplicate, Rename, Move, and Export. To ensure that these items are always available, items on the toolbar’s leading edge aren’t customizable.

- Center area. Common, useful controls appear in the center area, and the view title can appear here if it’s not on the leading edge. In macOS and iPadOS, people can add, remove, and rearrange items here if you let them customize the toolbar, and items in this section automatically collapse into the system-managed overflow menu when the window shrinks enough in size.

- Trailing edge. The trailing edge contains important items that need to remain available, buttons that open nearby inspectors, an optional search field, and the More menu that contains additional items and supports toolbar customization. It also includes a primary action like Done when one exists. Items on the trailing edge remain visible at all window sizes.

To position items in the groupings you want, pin them to the leading edge, center, or trailing edge, and insert space between buttons or other items where appropriate.

Group toolbar items logically by function and frequency of use.  For example, Keynote includes several sections that are based on functionality, including one for presentation-level commands, one for playback commands, and one for object insertion.

Group navigation controls and critical actions like Done, Close, or Save in dedicated, familiar, and visually distinct sections. This reflects their importance and helps people discover and understand these actions.

Keep consistent groupings and placement across platforms. This helps people develop familiarity with your app and trust that it behaves similarly regardless of where they use it.

Minimize the number of groups. Too many groups of controls can make a toolbar feel cluttered and confusing, even with the added space on iPad and Mac. In general, aim for a maximum of three.

Keep actions with text labels separate. Placing an action with a text label next to an action with a symbol can create the illusion of a single action with a combined text and symbol, leading to confusion and misinterpretation. If your toolbar includes multiple text-labeled buttons, the text of those buttons may appear to run together, making the buttons indistinguishable. Add separation by inserting fixed space between the buttons. For developer guidance, see .


### Platform considerations

No additional considerations for tvOS.


#### iOS

Prioritize only the most important items for inclusion in the main toolbar area. Because space is so limited, carefully consider which actions are essential to your app and include those first. Create a More menu to include additional items.

Use a large title to help people stay oriented as they navigate and scroll. By default, a large title transitions to a standard title as people begin scrolling the content, and transitions back to large when people scroll to the top, reminding them of their current location. For developer guidance, see .


#### iPadOS

Consider combining a toolbar with a tab bar. In iPadOS, a toolbar and a  can coexist in the same horizontal space at the top of the view. This is particularly useful for layouts where you want to navigate between a few main app areas while keeping the full width of the window available for content. For guidance, see  and .


#### macOS

In a macOS app, the toolbar resides in the frame at the top of a window, either below or integrated with the title bar. Note that window titles can display inline with controls, and toolbar items don’t include a bezel.

Make every toolbar item available as a command in the menu bar. Because people can customize the toolbar or hide it, it can’t be the only place that presents a command. In contrast, it doesn’t make sense to provide a toolbar item for every menu item, because not all menu commands are important enough or used often enough to warrant space in the toolbar.


#### visionOS

In visionOS, the system-provided toolbar appears along the bottom edge of a window, above the window-management controls, and in a parallel plane that’s slightly in front of the window along the z-axis.

To maintain the legibility of toolbar items as content scrolls behind them, visionOS uses a variable blur in the bar background. The variable blur anchors the bar above the scrolling content while letting the view’s glass material remain uniform and undivided.

In visionOS, you can supply either a symbol or a text label for each toolbar item. When people look at a toolbar item that contains a symbol, visionOS reveals the text label, providing additional information.

Prefer using a system-provided toolbar. The standard toolbar has a consistent and familiar appearance and is optimized to work well with eye and hand input. In addition, the system automatically places a standard toolbar in the correct position in relation to its window.

Avoid creating a vertical toolbar. In visionOS,  are vertical, so presenting a vertical toolbar could confuse people.

Try to prevent windows from resizing below the width of the toolbar. visionOS doesn’t include a menu bar where each app lists all its actions, so it’s important for the toolbar to provide reliable access to essential controls regardless of a window’s size.

If your app can enter a modal state, consider offering contextually relevant toolbar controls. For example, a photo-editing app might enter a modal state to help people perform a multistep editing task. In this scenario, the controls in the modal editing view are different from the controls in the main window. Be sure to reinstate the window’s standard toolbar controls when the app exits the modal state.

Avoid using a pull-down menu in a toolbar. A pull-down menu lets you offer additional actions related to a toolbar item, but can be difficult for people to discover and may clutter your interface. Because a toolbar is located at the bottom edge of a window in visionOS, a pull-down menu might obscure the standard window controls that appear below the bottom edge. For guidance, see .


#### watchOS

A toolbar button lets you offer important app functionality in a view that displays related content. You can place toolbar buttons in the top corners or along the bottom. If you place these buttons above scrolling content, the buttons always remain visible, as the content scrolls under them.

For developer guidance, see , , or .

You can also place a button in the scrolling view. By default, a scrolling toolbar button remains hidden until people reveal it by scrolling up. People frequently scroll to the top of a scrolling view, so discovering a toolbar button is automatic.

For developer guidance, see .

Use a scrolling toolbar button for an important action that isn’t a primary app function. A toolbar button gives you the flexibility to offer important functionality in a view whose primary purpose is related to that functionality, but may not be the same. For example, Mail provides the essential New Message action in a toolbar button at the top of the Inbox view. The primary purpose of the Inbox is to display a scrollable list of email messages, so it makes sense to offer the closely related compose action in a toolbar button at the top of the view.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Path controls

`/design/human-interface-guidelines/path-controls`

_A path control shows the file system path of a selected file or folder._

For example, choosing View > Show Path Bar in the Finder displays a path bar at the bottom of the window. It shows the path of the selected item, or the path of the window’s folder if nothing is selected.

There are two styles of path control.


### Best practices

Use a path control in the window body, not the window frame. Path controls aren’t intended for use in toolbars or status bars. Note that the path control in the Finder appears at the bottom of the window body, not in the status bar.


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

---

## Search fields

`/design/human-interface-guidelines/search-fields`

_A search field lets people search a collection of content for specific terms they enter._

A search field is an editable text field that displays a Search icon, a Clear button, and placeholder text where people can enter what they are searching for. Search fields can use a  as well as  to help filter and refine the scope of their search. Across each platform, there are different patterns for accessing search based on the goals and design of your app.

For developer guidance, see ; for guidance related to systemwide search, see .


### Best practices

Use placeholder text to help people know what they can search for. Placeholder text can be helpful when you need to reinforce the scope of your search or to educate people about the type of content that search has access to.

If possible, start search immediately when a person types. Searching while someone types makes the search experience feel more responsive because it provides results that are continuously refined as the text becomes more specific.

Consider showing suggested search terms. For example, you can display recent searches before search begins, or predictive search suggestions as a person types. This can help someone search faster, even when the search itself doesn’t begin immediately.

Simplify search results. Provide the most relevant search results first to minimize the need for someone to scroll to find what they’re looking for. In addition to prioritizing the most likely results, consider categorizing them to help people find what they want.

Consider letting people filter search results. For example, you can include a scope bar in the search results content area to help people quickly and easily filter search results.


### Scope bars and tokens

Scope bars and tokens are components you can use to let someone narrow the parameters of a search either before or after they make it.

- A scope bar is a control for filtering and adjusting the scope of a search.

- A token is a visual representation of a search term that someone can select and edit, and acts as a filter for any additional terms in the search.

Use a scope bar to filter among clearly defined search categories. A scope bar can help someone move from a broader scope to a narrower one. For example, in Mail on iPhone, a scope bar helps people move from searching their entire mailbox to just the specific mailbox they’re viewing. For developer guidance, see .

Default to a broader scope and let people refine it as they need. A broader scope provides context for the full set of available results, which helps guide people in a useful direction when they choose to narrow the scope.

Use tokens to filter by common search terms or items. When you define a token, the term it represents gains a visual treatment that encapsulates it, indicating that people can select and edit it as a single item. Tokens can clarify a search term, like filtering by a specific contact in Mail, or focus a search to a specific set of attributes, like filtering by photos in Messages. For the related macOS component, see .

Consider pairing tokens with search suggestions. People may not know which tokens are available, so pairing them with search suggestions can help people learn how to use them.


### Platform considerations

No additional considerations for visionOS.


#### iOS

There are three main places you can position the entry point for search:

- As a tab in a tab bar

- In a toolbar at the bottom or top of the screen

- Directly inline with content

Where search makes the most sense depends on the layout, content, and navigation of your app.


##### Search as a tab

You can place search as a tab in a tab bar, which keeps search visible and always available as people switch between the sections of your app. There are two styles of search tabs:

- Standard tab. This style displays the search tab uniformly with the rest of the tab bar. Tapping the search tab navigates people to a search landing page with a search field at the top.

- Button appearance. This style displays the search tab as a separate button and allows people to start searching immediately. Tapping the search tab brings focus to the search field and displays the keyboard.

Choose the standard tab style to provide suggestions, promote discovery, and encourage exploration. This style of search tab creates a dedicated landing page for search, providing an opportunity to reveal any content or suggestions that might be helpful before someone taps the field to begin the search. This approach is great for an app with a variety of rich content that people might want to explore. For example, Apple TV uses this search tab style to present its various genres and categories, helping ground people in what’s available before they search.

Choose the button appearance to help people quickly find what they need. When someone interacts with this style of search tab, the keyboard immediately appears with the search field above it, ready to begin the search. This approach provides a more transient experience that brings people directly back to their previous tab after they exit search, and is ideal when you want search to resolve quickly and seamlessly.


##### Search in a toolbar

As an alternative to search in a tab bar, you can also place search in a toolbar either at the bottom or top of the screen.

- You can include search in a bottom toolbar either as an expanded field or as a toolbar button, depending on how much space is available. When someone taps it, it animates into a search field above the keyboard so they can begin typing.

- You can include search in a top toolbar, also called a navigation bar, where it appears as a toolbar button. When someone taps it, it animates into a search field that appears either above the keyboard or at the top if there isn’t space at the bottom.

Place search at the bottom if there’s room. You can either add a search field to an existing toolbar, or as a new toolbar where search is the only item. Search at the bottom is useful in any situation where search is a priority, since it keeps the search experience easy to reach. Examples of apps with search at the bottom in various toolbar layouts include Settings, where it’s the only item, and Mail and Notes, where it fits alongside other important controls.

Place search at the top when itʼs important to defer to content at the bottom of the screen, or thereʼs no bottom toolbar. Use search at the top in cases where covering the content might interfere with a primary function of the app. The Wallet app, for example, includes event passes in a stack at the bottom of the screen for easy access and viewing at a glance.


##### Search as an inline field

In some cases you might want your app to include a search field inline with content.

Place search as an inline field when its position alongside the content it searches strengthens that relationship. When you need to filter or search within a single view, it can be helpful to have search appear directly next to content to illustrate that the search applies to it, rather than globally. This pattern is useful if your app has more than one search field and if location plays a critical role in the scope of your search. For example, although the main search in the Music app is a tab, people can navigate to their library and use an inline search field to filter their songs and albums.

When at the top, position an inline search field above the list it searches, and consider pinning it to the top toolbar when scrolling. This helps keep it distinct from search that appears in other locations.


#### iPadOS, macOS

The placement and behavior of the search field in iPadOS and macOS is similar. If your app is available on both iPad and Mac, try to keep the search experience as consistent as possible across both platforms.

Put a search field at the trailing side of the toolbar for many common uses. Many apps benefit from the familiar pattern of search in the toolbar, particularly apps with split views that need to search across multiple columns of information, like Mail, Notes, and Voice Memos. This placement makes great use of space because it lets people navigate results while keeping their selection visible in the detail view. Additionally, consider placing search in the toolbar if results appear in the detail view of your app, like in Freeform, where search in the toolbar filters the boards in the detail view below.

Include search at the top of the sidebar when filtering content or navigation there. Apps such as Settings take advantage of search to quickly filter the sidebar and expose sections that may be multiple levels deep, providing a simple way for people to search, preview, and navigate to the section or setting they’re looking for. This approach is useful if your app has a rich detail view and you need to create a distinct separation between the sidebar you’re filtering and the adjacent view.

Include search as an item in the sidebar or tab bar when you want an area dedicated to discovery. If your search is paired with rich suggestions, categories, or content that needs more space, it can be helpful to have a dedicated area for it. This is particularly useful for apps where browsing and search go hand in hand, like Music and TV, where it provides a unified location to highlight suggested content, categories, and recent searches. A dedicated area also ensures search is always available as people navigate and switch sections of your app.

In a search field in a dedicated area, consider immediately focusing the field when a person navigates to the area to help them search faster and locate the field more easily. An exception to this is on iPad when only a virtual keyboard is available, in which case it’s better to leave the field unfocused to prevent the keyboard from unexpectedly covering the view.

Account for window resizing with the placement of the search field. On iPad, the search field fluidly resizes with the app window like it does on Mac. However, for compact views on iPad, itʼs important to ensure that search is available where it’s most contextually useful. For example, Notes and Mail place search above the column for the content list when they resize down to a compact view.


#### tvOS

A search screen is a specialized keyboard screen that helps people enter search text, displaying search results beneath the keyboard in a fully customizable view. For developer guidance, see .

Provide suggestions to make searching easier. People typically don’t want to do a lot of typing in tvOS. To improve the search experience, provide popular and context-specific search suggestions, including recent searches when available. For developer guidance, see .


#### watchOS

When someone taps the search field, the system displays a text-input control that covers the entire screen. The app only returns to the search field after they tap the Cancel or Search button.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Sidebars

`/design/human-interface-guidelines/sidebars`

_A sidebar appears on the leading side of a view and lets people navigate between areas of your app or top-level collections of content, like folders and playlists._

A sidebar requires a large amount of vertical and horizontal space. When space is limited or you want to devote more of the screen to other information or functionality, a more compact control such as a tab bar may provide a better navigation experience. For many apps, you don’t need to choose between a tab bar or sidebar for navigation; instead, you can adopt a style of tab bar that provides both. For guidance, see  and .


### Best practices

Extend visually rich content beneath the sidebar. In iOS, iPadOS, and macOS, as with other controls such as toolbars and tab bars, sidebars can float above content in the  layer. To reinforce the separation, you can extend content beneath the sidebar either by letting it horizontally scroll or by applying a background extension effect. A background extension effect mirrors adjacent content to give the impression of stretching it under the sidebar. For developer guidance, see .

When possible, let people customize the contents of a sidebar. A sidebar lets people navigate to important areas in your app, so it works well when people can decide which areas are most important and in what order they appear.

Group hierarchy with disclosure controls if your app has a lot of content. Using  helps keep the sidebar’s vertical space to a manageable level.

Consider using familiar symbols to represent items in the sidebar.  provides a wide range of customizable symbols you can use to represent items in your app. If you need to use a custom icon, consider creating a  rather than using a bitmap image. Download the SF Symbols app from .

Consider letting people hide the sidebar. People sometimes want to hide the sidebar to create more room for content details or to reduce distraction. When possible, let people hide and show the sidebar using the platform-specific interactions they already know. For example, in iPadOS, people expect to use the built-in edge swipe gesture; in macOS, you can include a show/hide button or add Show Sidebar and Hide Sidebar commands to your app’s View menu. In visionOS, a window typically expands to accommodate a sidebar, so people rarely need to hide it. Avoid hiding the sidebar by default to ensure that it remains discoverable.

In general, show no more than two levels of hierarchy in a sidebar. When a data hierarchy is deeper than two levels, consider using a split view interface that includes a content list between the sidebar items and detail view.

If you need to include two levels of hierarchy in a sidebar, use succinct, descriptive labels to title each group. To help keep labels short, omit unnecessary words.

Make sure any sidebar icon colors you choose serve a clear purpose. By default, sidebar icons use your app’s . In macOS, people can change the system accent color, which applies to all apps. When they do this, they expect all sidebar icons to appear in that color, so make sure your sidebar icons display the color people choose. However, if you use them sparingly, fixed colors can help clarify the meaning of an icon or draw attention to it. For example, the VIP icon in Mail uses a yellow color to set it apart from other sidebar icons, providing a visual cue about its importance.


### Platform considerations

No additional considerations for tvOS. Not supported in watchOS.


#### iOS, iPadOS

When you use the  style of tab view to present a sidebar, you choose whether to display a sidebar or a tab bar when your app opens. Both variations include a button that people can use to switch between them. This style also adapts its appearance depending on the platform, and responds automatically to rotation and window resizing, providing a version of the control that’s appropriate to the width of the view.

> [NOTE] To display a sidebar only, use  to present a sidebar in the primary pane of a split view, or use .

Consider using a tab bar first. A tab bar provides more space to feature content, and offers enough flexibility to navigate between many apps’ main areas. If you need to expose more areas than fit in a tab bar, the tab bar’s convertible sidebar-style appearance can provide access to content that people use less frequently. For guidance, see .

If necessary, apply the correct appearance to a sidebar. If you’re not using SwiftUI to create a sidebar, you can use the  appearance of a collection view list layout. For developer guidance, see .


#### macOS

A sidebar’s row height, text, and glyph size depend on its overall size, which can be small, medium, or large. You can set the size programmatically, but people can also change it by selecting a different sidebar icon size in General settings.

Consider automatically hiding and revealing a sidebar when its container window resizes. For example, reducing the size of a Mail viewer window can automatically collapse its sidebar, making more room for message content.

Avoid putting critical information or actions at the bottom of a sidebar. People often relocate a window in a way that hides its bottom edge.


#### visionOS

If your app’s hierarchy is deep, consider using a sidebar within a tab in a tab bar. In this situation, a sidebar can support secondary navigation within the tab. If you do this, be sure to prevent selections in the sidebar from changing which tab is currently open.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Tab bars

`/design/human-interface-guidelines/tab-bars`

_A tab bar lets people navigate between top-level sections of your app._

Tab bars help people understand the different types of information or functionality that an app provides. They also let people quickly switch between sections of the view while preserving the current navigation state within each section.


### Best practices

Use a tab bar to support navigation, not to provide actions. A tab bar lets people navigate among different sections of an app, like the Alarm, Stopwatch, and Timer tabs in the Clock app. If you need to provide controls that act on elements in the current view, use a  instead.

Make sure the tab bar is visible when people navigate to different sections of your app. If you hide the tab bar, people can forget which area of the app they’re in. The exception is when a modal view covers the tab bar, because a modal is temporary and self-contained.

Use the appropriate number of tabs required to help people navigate your app. As a representation of your app’s hierarchy, it’s important to weigh the complexity of additional tabs against the need for people to frequently access each section; keep in mind that it’s generally easier to navigate among fewer tabs. Where available, consider a sidebar or a tab bar that adapts to a sidebar as an alternative for an app with a complex information structure.

Avoid overflow tabs. Depending on device size and orientation, the number of visible tabs can be smaller than the total number of tabs. If horizontal space limits the number of visible tabs, the trailing tab becomes a More tab in iOS and iPadOS, revealing the remaining items in a separate list. The More tab makes it harder for people to reach and notice content on tabs that are hidden, so limit scenarios in your app where this can happen.

Don’t disable or hide tab bar buttons, even when their content is unavailable. Having tab bar buttons available in some cases but not others makes your app’s interface appear unstable and unpredictable. If a section is empty, explain why its content is unavailable.

Include tab labels to help with navigation. A tab label appears beneath or beside a tab bar icon, and can aid navigation by clearly describing the type of content or functionality the tab contains. Use single words whenever possible.

Consider using SF Symbols to provide familiar, scalable tab bar icons. When you use , tab bar icons automatically adapt to different contexts. For example, the tab bar can be regular or compact, depending on the device and orientation. Tab bar icons appear above tab labels in compact views, whereas in regular views, the icons and labels appear side by side. Prefer filled symbols or icons for consistency with the platform.

If you’re creating custom tab bar icons, see  for tab bar icon dimensions.

Use a badge to indicate that critical information is available. You can display a badge — a red oval containing white text and either a number or an exclamation point — on a tab to indicate that there’s new or updated information in the section that warrants a person’s attention. Reserve badges for critical information so you don’t dilute their impact and meaning. For guidance, see .

Avoid applying a similar color to tab labels and content layer backgrounds. If your app already has bright, colorful content in the content layer, prefer a monochromatic appearance for tab bars, or choose an accent color with sufficient visual differentiation. For more guidance, see .


### Platform considerations

No additional considerations for macOS. Not supported in watchOS.


#### iOS

A tab bar floats above content at the bottom of the screen. Its items rest on a  background that allows content beneath to peek through.

For tab bars with an attached accessory, like the MiniPlayer in Music, you can choose to minimize the tab bar and move the accessory inline with it when a person scrolls down. A person can exit the minimized state by tapping a tab or scrolling to the top of the view. For developer guidance, see  and .

A tab bar can include a dedicated search tab at the trailing end. For guidance, see .


#### iPadOS

The system displays a tab bar near the top of the screen. You can choose to have the tab bar appear as a fixed element, or with a button that converts it to a sidebar. For developer guidance, see  and .

> [NOTE] To present a sidebar without the option to convert it to a tab bar, use a  instead of a tab view. For guidance, see .

Prefer a tab bar for navigation. A tab bar provides access to the sections of your app that people use most. If your app is more complex, you can provide the option to convert the tab bar to a sidebar so people can access a wider set of navigation options.

Let people customize the tab bar. In apps with a lot of sections that people might want to access, it can be useful to let people select items that they use frequently and add them to the tab bar, or remove items that they use less frequently. For example, in the Music app, a person can choose a favorite playlist to display in the tab bar. If you let people select their own tabs, aim for a default list of five or fewer to preserve continuity between compact and regular view sizes. For developer guidance, see  and .


#### tvOS

A tab bar is highly customizable. For example, you can:

- Specify a tint, color, or image for the tab bar background

- Choose a font for tab items, including a different font for the selected item

- Specify tints for selected and unselected items

- Add button icons, like settings and search

By default, a tab bar is translucent, and only the selected tab is opaque. When people use the remote to focus on the tab bar, the selected tab includes a drop shadow that emphasizes its selected state. The height of a tab bar is 68 points, and its top edge is 46 points from the top of the screen; you can’t change either of these values.

If there are more items than can fit in the tab bar, the system truncates the rightmost item by applying a fade effect that begins at the right side of the tab bar. If there are enough items to cause scrolling, the system also applies a truncating fade effect that starts from the left side.

Be aware of tab bar scrolling behaviors. By default, people can scroll the tab bar offscreen when the current tab contains a single main view. You can see examples of this behavior in the Watch Now, Movies, TV Show, Sports, and Kids tabs in the TV app. The exception is when a screen contains a split view, such as the TV app’s Library tab or an app’s Settings screen. In this case, the tab bar remains pinned at the top of the view while people scroll the content within the primary and secondary panes of the split view. Regardless of a tab’s contents, focus always returns to the tab bar at the top of the page when people press Menu on the remote.

In a live-viewing app, organize tabs in a consistent way. For the best experience, organize content in live-streaming apps with tabs in the following order:

- Live content

- Cloud DVR or other recorded content

- Other content

For additional guidance, see .


#### visionOS

In visionOS, a tab bar is always vertical, floating in a position that’s fixed relative to the window’s leading side. When people look at a tab bar, it automatically expands; to open a specific tab, people look at the tab and tap. While a tab bar is expanded, it can temporarily obscure the content behind it.

Supply a symbol and a text label for each tab. A tab’s symbol is always visible in the tab bar. When people look at the tab bar, the system reveals tab labels, too. Even though the tab bar expands, you need to keep tab labels short so people can read them at a glance.

If it makes sense in your app, consider using a sidebar within a tab. If your app’s hierarchy is deep, you might want to use a  to support secondary navigation within a tab. If you do this, be sure to prevent selections in the sidebar from changing which tab is currently open.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — SwiftUI

 — UIKit

 — UIKit


##### Videos


### Change log

---

## Token fields

`/design/human-interface-guidelines/token-fields`

_A token field is a type of text field that can convert text into  that are easy to select and manipulate._

For example, Mail uses token fields for the address fields in the compose window. As people enter recipients, Mail converts the text that represents each recipient’s name into a token. People can select these recipient tokens and drag to reorder them or move them into a different field.

You can configure a token field to present people with a list of suggestions as they enter text into the field. For example, Mail suggests recipients as people type in an address field. When people select a suggested recipient, Mail inserts the recipient into the field as a token.

An individual token can also include a contextual menu that offers information about the token or editing options. For example, a recipient token in Mail includes a contextual menu with commands for editing the recipient name, marking the recipient as a VIP, and viewing the recipient’s contact card, among others.

Tokens can also represent search terms in some situations; for guidance, see .


### Best practices

Add value with a context menu. People often benefit from a  with additional options or information about a token.

Consider providing additional ways to convert text into tokens. By default, text people enter turns into a token whenever they type a comma. You can specify additional shortcuts, such as pressing Return, that also invoke this action.

Consider customizing the delay the system uses before showing suggested tokens. By default, suggestions appear immediately. However, suggestions that appear too quickly may distract people while they’re typing. If your app suggests tokens, consider adjusting the delay to a comfortable level.


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, and watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

---

## Action sheets

`/design/human-interface-guidelines/action-sheets`

_An action sheet is a modal view that presents choices related to an action people initiate._

> [NOTE] When you use SwiftUI, you can offer action sheet functionality in all platforms by specifying a  for a confirmation dialog. If you use UIKit, you use the  to display an action sheet in iOS, iPadOS, and tvOS.


### Best practices

Use an action sheet — not an alert — to offer choices related to an intentional action. For example, when people cancel the message they’re editing in Mail on iPhone, an action sheet provides two choices: delete the draft, or save the draft. Although an alert can also help people confirm or cancel an action that has destructive consequences, it doesn’t provide additional choices related to the action. More importantly, an alert is usually unexpected, generally telling people about a problem or a change in the current situation that might require them to act. For guidance, see .

Use action sheets sparingly. Action sheets give people important information and choices, but they interrupt the current task to do so. To encourage people to pay attention to action sheets, avoid using them more than necessary.

Aim to keep titles short enough to display on a single line. A long title is difficult to read quickly and might get truncated or require people to scroll.

Provide a message only if necessary. In general, the title — combined with the context of the current action — provides enough information to help people understand their choices.

If necessary, provide a Cancel button that lets people reject an action that might destroy data. Place the Cancel button at the bottom of the action sheet (or in the upper-left corner of the sheet in watchOS). A SwiftUI confirmation dialog includes a Cancel button by default.

Make destructive choices visually prominent. Use the destructive style for buttons that perform destructive actions, and place these buttons at the top of the action sheet where they tend to be most noticeable. For developer guidance, see  (SwiftUI) or  (UIKit).


### Platform considerations

No additional considerations for macOS or tvOS. Not supported in visionOS.


#### iOS, iPadOS

Use an action sheet — not a menu — to provide choices related to an action. People are accustomed to having an action sheet appear when they perform an action that might require clarifying choices. In contrast, people expect a menu to appear when they choose to reveal it.

Avoid letting an action sheet scroll. The more buttons an action sheet has, the more time and effort it takes for people to make a choice. Also, scrolling an action sheet can be hard to do without inadvertently tapping a button.


#### watchOS

The system-defined style for action sheets includes a title, an optional message, a Cancel button, and one or more additional buttons. The appearance of this interface is different depending on the device.

Each button has an associated style that conveys information about the button’s effect. There are three system-defined button styles:

Avoid displaying more than four buttons in an action sheet, including the Cancel button. When there are fewer buttons onscreen, it’s easier for people to view all their options at once. Because the Cancel button is required, aim to provide no more than three additional choices.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

---

## Alerts

`/design/human-interface-guidelines/alerts`

_An alert gives people critical information they need right away._

For example, an alert can tell people about a problem, warn them when their action might destroy data, and give them an opportunity to confirm a purchase or another important action they initiated.


### Best practices

Use alerts sparingly. Alerts give people important information, but they interrupt the current task to do so. Encourage people to pay attention to your alerts by making certain that each one offers only essential information and useful actions.

Avoid using an alert merely to provide information. People don’t appreciate an interruption from an alert that’s informative, but not actionable. If you need to provide only information, prefer finding an alternative way to communicate it within the relevant context. For example, when a server connection is unavailable, Mail displays an indicator that people can choose to learn more.

Avoid displaying alerts for common, undoable actions, even when they’re destructive. For example, you don’t need to alert people about data loss every time they delete an email or file because they do so with the intention of discarding data, and they can undo the action. In comparison, when people take an uncommon destructive action that they can’t undo, it’s important to display an alert in case they initiated the action accidentally.

Avoid showing an alert when your app starts. If you need to inform people about new or important information the moment they open your app, design a way to make the information easily discoverable. If your app detects a problem at startup, like no network connection, consider alternative ways to let people know. For example, you could show cached or placeholder data and a nonintrusive label that describes the problem.


### Anatomy

An alert is a modal view that can look different in different platforms and devices.


### Content

In all platforms, alerts display a title, optional informative text, and up to three buttons. On some platforms, alerts can include additional elements.

- In iOS, iPadOS, macOS, and visionOS, an alert can include a text field.

- Alerts in macOS and visionOS can include an icon and an accessory view.

- macOS alerts can add a suppression  and a .

In all alert copy, be direct, and use a neutral, approachable tone. Alerts often describe problems and serious situations, so avoid being oblique or accusatory, or masking the severity of the issue.

Write a title that clearly and succinctly describes the situation. You need to help people quickly understand the situation, so be complete and specific, without being verbose. As much as possible, describe what happened, the context in which it happened, and why. Avoid writing a title that doesn’t convey useful information — like “Error” or “Error 329347 occurred” — but also avoid overly long titles that wrap to more than two lines. If the title is a complete sentence, use  and appropriate ending punctuation. If the title is a sentence fragment, use title-style capitalization, and don’t add ending punctuation.

Include informative text only if it adds value. If you need to add an informative message, keep it as short as possible, using complete sentences, sentence-style capitalization, and appropriate punctuation.

Avoid explaining alert buttons. If your alert text and button titles are clear, you don’t need to explain what the buttons do. In rare cases where you need to provide guidance on choosing a button, use a term like choose to account for people’s current device and interaction method, and refer to a button using its exact title without quotes. For guidance, see .

If supported, include a text field only if you need people’s input to resolve the situation. For example, you might need to present a secure text field to receive a password.


### Buttons

Create succinct, logical button titles. Aim for a one- or two-word title that describes the result of selecting the button. Prefer verbs and verb phrases that relate directly to the alert text — for example, “View All,” “Reply,” or “Ignore.” In informational alerts only, you can use “OK” for acceptance, avoiding “Yes” and “No.” Always use “Cancel” to title a button that cancels the alert’s action. As with all button titles, use  and no ending punctuation.

Avoid using OK as the default button title unless the alert is purely informational. The meaning of “OK” can be unclear even in alerts that ask people to confirm that they want to do something. For example, does “OK” mean “OK, I want to complete the action” or “OK, I now understand the negative results my action would have caused”? A specific button title like “Erase,” “Convert,” “Clear,” or “Delete” helps people understand the action they’re taking.

Place buttons where people expect. In general, place the button people are most likely to choose on the trailing side in a row of buttons or at the top in a stack of buttons. Always place the default button on the trailing side of a row or at the top of a stack. Cancel buttons are typically on the leading side of a row or at the bottom of a stack.

Use the destructive style to identify a button that performs a destructive action people didn’t deliberately choose. For example, when people deliberately choose a destructive action — such as Empty Trash — the resulting alert doesn’t apply the destructive style to the Empty Trash button because the button performs the person’s original intent. In this scenario, the convenience of pressing Return to confirm the deliberately chosen Empty Trash action outweighs the benefit of reaffirming that the button is destructive. In contrast, people appreciate an alert that draws their attention to a button that can perform a destructive action they didn’t originally intend.

If there’s a destructive action, include a Cancel button to give people a clear, safe way to avoid the action. Always use the title “Cancel” for a button that cancels an alert’s action. Note that you don’t want to make a Cancel button the default button. If you want to encourage people to read an alert and not just automatically press Return to dismiss it, avoid making any button the default button. Similarly, if you must display an alert with a single button that’s also the default, use a Done button, not a Cancel button.

Provide alternative ways to cancel an alert when it makes sense. In addition to choosing a Cancel button, people appreciate using keyboard shortcuts or other quick ways to cancel an onscreen alert. For example:


### Platform considerations

No additional considerations for tvOS or watchOS.


#### iOS, iPadOS

Use an action sheet — not an alert — to offer choices related to an intentional action. For example, when people cancel the Mail message they’re editing, an action sheet provides three choices: delete the edits (or the entire draft), save the draft, or return to editing. Although an alert can also help people confirm or cancel an action that has destructive consequences, it doesn’t provide additional choices related to the action. For guidance, see .

When possible, avoid displaying an alert that scrolls. Although an alert might scroll if the text size is large enough, be sure to minimize the potential for scrolling by keeping alert titles short and including a brief message only when necessary.


#### macOS

macOS automatically displays your app icon in an alert, but you can supply an alternative icon or symbol. In addition, macOS lets you:

- Configure repeating alerts to let people suppress subsequent occurrences of the same alert.

- Append a custom view if it’s necessary to provide additional information (for developer guidance, see ).

- Include a Help button that opens your help documentation (see ).

Use a caution symbol sparingly. Using a caution symbol like `exclamationmark.triangle` too frequently in your alerts diminishes its significance. Use the symbol only when extra attention is really needed, as when confirming an action that might result in unexpected loss of data. Don’t use the symbol for tasks whose only purpose is to overwrite or remove data, such as a save or empty trash.


#### visionOS

When your app is running in the Shared Space, visionOS displays an alert in front of the app’s window, slightly forward along the z-axis.

If someone moves a window without dismissing its alert, the alert remains anchored to the window. If your app is running in a Full Space, the system displays the alert centered in the wearer’s .

If you need to display an accessory view in a visionOS alert, create a view that has a maximum height of 154 pt and a 16-pt corner radius.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Page controls

`/design/human-interface-guidelines/page-controls`

_A page control displays a row of indicator images, each of which represents a page in a flat list._

The scrolling row of indicators helps people navigate the list to find the page they want. Page controls can handle an arbitrary number of pages, making them particularly useful in situations where people can create custom lists.

Page controls appear as a series of small indicator dots by default, representing the available pages. A solid dot denotes the current page. Visually, these dots are always equidistant, and are clipped if there are too many to fit in the window.


### Best practices

Use page controls to represent movement between an ordered list of pages. Page controls don’t represent hierarchical or nonsequential page relationships. For more complex navigation, consider using a sidebar or split view instead.

Center a page control at the bottom of the view or window. To ensure people always know where to find a page control, center it horizontally and position it near the bottom of the view.

Although page controls can handle any number of pages, don’t display too many. More than about 10 dots are hard to count at a glance. If your app needs to display more than 10 pages as peers, consider using a different arrangement‚ such as a grid, that lets people navigate the content in any order.


### Customizing indicators

By default, a page control uses the system-provided dot image for all indicators, but it can also display a unique image to help people identify a specific page. For example, Weather uses the `location.fill` symbol to distinguish the current location’s page.

If it enhances your app or game, you can provide a custom image to use as the default image for all indicators and you can also supply a different image for a specific page. For developer guidance, see  and .

Make sure custom indicator images are simple and clear. Avoid complex shapes, and don’t include negative space, text, or inner lines, because these details can make an icon muddy and indecipherable at very small sizes. Consider using simple  as indicators or design your own icons. For guidance, see .

Customize the default indicator image only when it enhances the page control’s overall meaning. For example, if every page you list contains bookmarks, you might use the `bookmark.fill` symbol as the default indicator image.

Avoid using more than two different indicator images in a page control. If your list contains one page with special meaning — like the current-location page in Weather — you can make the page easy to find by giving it a unique indicator image. In contrast, a page control that uses several unique images to mark several important pages is hard to use because people must memorize the meaning of each image. A page control that displays more than two types of indicator images tends to look messy and haphazard, even when each image is clear.

Avoid coloring indicator images. Custom colors can reduce the contrast that differentiates the current-page indicator and makes the page control visible on the screen. To ensure that your page control is easy to use and looks good in different contexts, let the system automatically color the indicators.


### Platform considerations

Not supported in macOS.


#### iOS, iPadOS

A page control can adjust the appearance of indicators to provide more information about the list. For example, the control highlights the indicator of the current page so people can estimate the page’s relative position in the list. When there are more indicators than fit in the space, the control can shrink indicators at both sides to suggest that more pages are available.

People interact with page controls by tapping or scrubbing (to scrub, people touch the control and drag left or right). Tapping on the leading or trailing side of the current-page indicator reveals the next or previous page; in iPadOS, people can also use the pointer to target a specific indicator. Scrubbing opens pages in sequence, and scrubbing past the leading or trailing edge of the control helps people quickly reach the first or last page.

> [NOTE] In the API, tapping is a discrete interaction, whereas scrubbing is a continuous interaction; for developer guidance, see .

Avoid animating page transitions during scrubbing. People can scrub very quickly, and using the scrolling animation for every transition can make your app lag and cause distracting visual flashes. Use the animated scrolling transition only for tapping.

A page control can include a translucent, rounded-rectangle background appearance that provides visual contrast for the indicators. You can choose one of the following background styles:

- Automatic — Displays the background only when people interact with the control. Use this style when the page control isn’t the primary navigational element in the UI.

- Prominent — Always displays the background. Use this style only when the control is the primary navigational control in the screen.

- Minimal — Never displays the background. Use this style when you just want to show the position of the current page in the list and you don’t need to provide visual feedback during scrubbing.

For developer guidance, see .

Avoid supporting the scrubber when you use the minimal background style. The minimal style doesn’t provide visual feedback during scrubbing. If you want to let people scrub a list of pages in your app, use the automatic or prominent background styles.


#### tvOS

Use page controls on collections of full-screen pages. A page control is designed to operate in a full-screen environment where multiple content-rich pages are peers in the page hierarchy. Inclusion of additional controls makes it difficult to maintain focus while moving between pages.


#### visionOS

In visionOS, page controls represent available pages and indicate the current page, but people don’t interact with them.


#### watchOS

In watchOS, page controls can be displayed at the bottom of the screen for horizontal pagination, or next to the Digital Crown when presenting a vertical . When using vertical tab views, the page indicator shows people where they are in the navigation, both within the current page and within the set of pages. The page control transitions between scrolling through a page’s content and scrolling to other pages.

Use vertical pagination to separate multiple views into distinct, purposeful pages. Give each page a clear purpose, and let people scroll through the pages using the Digital Crown. In watchOS, this design is more effective than horizontal pagination or many levels of hierarchical navigation.

Consider limiting the content of an individual page to a single screen height. Embracing this constraint encourages each page to serve a clear and distinct purpose and results in a more glanceable design. Use variable-height pages judiciously and, if possible, only place them after fixed-height pages in your app design.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit


### Change log

---

## Panels

`/design/human-interface-guidelines/panels`

_In a macOS app, a panel typically floats above other open windows providing supplementary controls, options, or information related to the active window or current selection._

In general, a panel has a less prominent appearance than an app’s . When the situation calls for it, a panel can also use a dark, translucent style to support a heads-up display (or HUD) experience.

When your app runs in other platforms, consider using a modal view to present supplementary content that’s relevant to the current task or selection. For guidance, see .


### Best practices

Use a panel to give people quick access to important controls or information related to the content they’re working with. For example, you might use a panel to provide controls or settings that affect the selected item in the active document or window.

Consider using a panel to present inspector functionality. An inspector displays the details of the currently selected item, automatically updating its contents when the item changes or when people select a new item. In contrast, if you need to present an Info window — which always maintains the same contents, even when the selected item changes — use a regular window, not a panel. Depending on the layout of your app, you might also consider using a  pane to present an inspector.

Prefer simple adjustment controls in a panel. As much as possible, avoid including controls that require typing text or selecting items to act upon because these actions can require multiple steps. Instead, consider using controls like sliders and steppers because these components can give people more direct control.

Write a brief title that describes the panel’s purpose. Because a panel often floats above other open windows in your app, it needs a title bar so people can position it where they want. Create a short title using a noun — or a noun phrase with  — that can help people recognize the panel onscreen. For example, macOS provides familiar panels titled “Fonts” and “Colors,” and many apps use the title “Inspector.”

Show and hide panels appropriately. When your app becomes active, bring all of its open panels to the front, regardless of which window was active when the panel opened. When your app is inactive, hide all of its panels.

Avoid including panels in the Window menu’s documents list. It’s fine to include commands for showing or hiding panels in the , but panels aren’t documents or standard app windows, and they don’t belong in the Window menu’s list.

In general, avoid making a panel’s minimize button available. People don’t usually need to minimize a panel, because it displays only when needed and disappears when the app is inactive.

Refer to panels by title in your interface and in help documentation. In menus, use the panel’s title without including the term panel: for example, “Show Fonts,” “Show Colors,” and “Show Inspector.” In help documentation, it can be confusing to introduce “panel” as a different type of window, so it’s generally best to refer to a panel by its title or — when it adds clarity — by appending window to the title. For example, the title “Inspector” often supplies enough context to stand on its own, whereas it can be clearer to use “Fonts window”  and “Colors window” instead of just “Fonts” and “Colors.”


### HUD-style panels

A HUD-style panel serves the same function as a standard panel, but its appearance is darker and translucent. HUDs work well in apps that present highly visual content or that provide an immersive experience, such as media editing or a full-screen slide show. For example, QuickTime Player uses a HUD to display inspector information without obstructing too much content.

Prefer standard panels. People can be distracted or confused by a HUD when there’s no logical reason for its presence. Also, a HUD might not match the current appearance setting. In general, use a HUD only:

- In a media-oriented app that presents movies, photos, or slides

- When a standard panel would obscure essential content

- When you don’t need to include controls — with the exception of the disclosure triangle, most system-provided controls don’t match a HUD’s appearance.

Maintain one panel style when your app switches modes. For example, if you use a HUD when your app is in full-screen mode, prefer maintaining the HUD style when people take your app out of full-screen mode.

Use color sparingly in HUDs. Too much color in the dark appearance of a HUD can be distracting. Often, you need only small amounts of high-contrast color to highlight important information in a HUD.

Keep HUDs small. HUDs are designed to be unobtrusively useful, so letting them grow too large defeats their primary purpose. Don’t let a HUD obscure the content it adjusts, and make sure it doesn’t compete with the content for people’s attention.

For developer guidance, see .


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

 — AppKit

---

## Popovers

`/design/human-interface-guidelines/popovers`

_A popover is a transient view that appears above other content when people click or tap a control or interactive area._


### Best practices

Use a popover to expose a small amount of information or functionality. Because a popover disappears after people interact with it, limit the amount of functionality in the popover to a few related tasks. For example, a calendar event popover makes it easy for people to change the date or time of an event, or to move it to another calendar. The popover disappears after the change, letting people continue reviewing the events on their calendar.

Consider using popovers when you want more room for content. Views like sidebars and panels take up a lot of space. If you need content only temporarily, displaying it in a popover can help streamline your interface.

Position popovers appropriately. Make sure a popover’s arrow points as directly as possible to the element that revealed it. Ideally, a popover doesn’t cover the element that revealed it or any essential content people may need to see while using it.

Use a Close button for confirmation and guidance only. A Close button, including Cancel or Done, is worth including if it provides clarity, like exiting with or without saving changes. Otherwise, a popover generally closes when people click or tap outside its bounds or select an item in the popover. If multiple selections are possible, make sure the popover remains open until people explicitly dismiss it or they click or tap outside its bounds.

Always save work when automatically closing a nonmodal popover. People can unintentionally dismiss a nonmodal popover by clicking or tapping outside its bounds. Discard people’s work only when they click or tap an explicit Cancel button.

Show one popover at a time. Displaying multiple popovers clutters the interface and causes confusion. Never show a cascade or hierarchy of popovers, in which one emerges from another. If you need to show a new popover, close the open one first.

Don’t show another view over a popover. Make sure nothing displays on top of a popover, except for an alert.

When possible, let people close one popover and open another with a single click or tap. Avoiding extra gestures is especially desirable when several different bar buttons each open a popover.

Avoid making a popover too big. Make a popover only big enough to display its contents and point to the place it came from. If necessary, the system can adjust the size of a popover to ensure it fits well in the interface.

Provide a smooth transition when changing the size of a popover. Some popovers provide both condensed and expanded views of the same information. If you adjust the size of a popover, animate the change to avoid giving the impression that a new popover replaced the old one.

Avoid using the word popover in help documentation. Instead, refer to a specific task or selection. For example, instead of “Select the Show button at the bottom of the popover,” you might write “Select the Show button.”

Avoid using a popover to show a warning. People can miss a popover or accidentally close it. If you need to warn people, use an  instead.


### Platform considerations

No additional considerations for visionOS. Not supported in tvOS or watchOS.


#### iOS, iPadOS

Avoid displaying popovers in compact views. Make your app or game dynamically adjust its layout based on the size class of the content area. Reserve popovers for wide views; for compact views, use all available screen space by presenting information in a full-screen modal view like a sheet instead. For related guidance, see .


#### macOS

You can make a popover detachable in macOS, which becomes a separate panel when people drag it. The panel remains visible onscreen while people interact with other content.

Consider letting people detach a popover. People might appreciate being able to convert a popover into a panel if they want to view other information while the popover remains visible.

Make minimal appearance changes to a detached popover. A panel that looks similar to the original popover helps people maintain context.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit

---

## Scroll views

`/design/human-interface-guidelines/scroll-views`

_A scroll view lets people view content that’s larger than the view’s boundaries by moving the content vertically or horizontally._

The scroll view itself has no appearance, but it can display a translucent scroll indicator that typically appears after people begin scrolling the view’s content. Although the appearance and behavior of scroll indicators can vary per platform, all indicators provide visual feedback about the scrolling action. For example, in iOS, iPadOS, macOS, visionOS, and watchOS, the indicator shows whether the currently visible content is near the beginning, middle, or end of the view.


### Best practices

Support default scrolling gestures and keyboard shortcuts. People are accustomed to the systemwide scrolling behavior and expect it to work everywhere. If you build custom scrolling for a view, make sure your scroll indicators use the elastic behavior that people expect.

Make it apparent when content is scrollable. Because scroll indicators aren’t always visible, it can be helpful to make it obvious when content extends beyond the view. For example, displaying partial content at the edge of a view indicates that there’s more content in that direction. Although most people immediately try scrolling a view to discover if additional content is available, it’s considerate to draw their attention to it.

Avoid putting a scroll view inside another scroll view with the same orientation. Nesting scroll views that have the same orientation can create an unpredictable interface that’s difficult to control. It’s alright to place a horizontal scroll view inside a vertical scroll view (or vice versa), however.

Consider supporting page-by-page scrolling if it makes sense for your content. In some situations, people appreciate scrolling by a fixed amount of content per interaction instead of scrolling continuously. On most platforms, you can define the size of such a page — typically the current height or width of the view — and define an interaction that scrolls one page at a time. To help maintain context during page-by-page scrolling, you can define a unit of overlap, such as a line of text, a row of glyphs, or part of a picture, and subtract the unit from the page size. For developer guidance, see .

In some cases, scroll automatically to help people find their place. Although people initiate almost all scrolling, automatic scrolling can be helpful when relevant content is no longer in view, such as when:

- Your app performs an operation that selects content or places the insertion point in an area that’s currently hidden. For example, when your app locates text that people are searching for, scroll the content to bring the new selection into view.

- People start entering information in a location that’s not currently visible. For example, if the insertion point is on one page and people navigate to another page, scroll back to the insertion point as soon as they begin to enter text.

- The pointer moves past the edge of the view while people are making a selection. In this case, follow the pointer by scrolling in the direction it moves.

- People select something and scroll to a new location before acting on the selection. In this case, scroll until the selection is in view before performing the operation.

In all cases, automatically scroll the content only as much as necessary to help people retain context. For example, if part of a selection is visible, you don’t need to scroll the entire selection into view.

If you support zoom, set appropriate maximum and minimum scale values. For example, zooming in on text until a single character fills the screen doesn’t make sense in most situations.


### Scroll edge effects

In iOS, iPadOS, and macOS, a scroll edge effect provides a visual separation between certain interface elements, such as , and the scrolling content area behind them. If you use custom bars, you might want to add this effect manually if the top layer of your interface needs extra clarity, or adjust its style from automatic to the hard or soft style.

Prefer the automatic scroll edge effect style. Where possible, use the default  style of the scroll edge effect. This style provides a more opaque visual separation for top toolbars that contain a large number of controls, text that appears outside of  controls, and pinned table headers. If you use the soft scroll edge effect style instead, thoroughly test your interface to ensure your controls maintain legibility in a variety of contexts.

Only use a scroll edge effect when a scroll view is behind floating interface elements. Scroll edge effects aren’t decorative. They don’t block or darken like overlays; they exist to ensure controls stay visually distinct.

Apply one scroll edge effect per view. In split view layouts on iPad and Mac, each pane can have its own scroll edge effect; in this case, keep them consistent in height to maintain alignment.

For developer guidance, see , , and .


### Platform considerations


#### iOS, iPadOS

Consider showing a page control when a scroll view is in page-by-page mode.  show how many pages, screens, or other chunks of content are available and indicates which one is currently visible. For example, Weather uses a page control to indicate movement between people’s saved locations. If you show a page control with a scroll view, don’t show the scrolling indicator on the same axis to avoid confusing people with redundant controls.


#### macOS

In macOS, a scroll indicator is commonly called a scroll bar.

If necessary, use small or mini scroll bars in a panel. When space is tight, you can use smaller scroll bars in panels that need to coexist with other windows. Be sure to use the same size for all controls in such a panel.


#### tvOS

Views in tvOS can scroll, but they aren’t treated as distinct objects with scroll indicators. Instead, when content exceeds the size of the screen, the system automatically scrolls the interface to keep focused items visible.


#### visionOS

In visionOS, the scroll indicator has a small, fixed size to help communicate that people can scroll efficiently without making large movements. To make it easy to find, the scroll indicator always appears in a predictable location with respect to the window: vertically centered at the trailing edge during vertical scrolling and horizontally centered at the window’s bottom edge during horizontal scrolling.

When people begin swiping content in the direction they want it to scroll, the scroll indicator appears at the window’s edge, visually reinforcing the effect of their gesture and providing feedback about the content’s current position and overall length. When people look at the scroll indicator and begin a drag gesture, the indicator enables a jog bar experience that lets people manipulate the scrolling speed instead of the content’s position. In this experience, the scroll indicator reveals tick marks that speed up or slow down as people make small adjustments to their gesture, providing visual feedback that helps people precisely control scrolling acceleration.

If necessary, account for the size of the scroll indicator. Although the indicator’s overall size is small, it’s a little thicker than the same component in iOS. If your content uses tight margins, consider increasing them to prevent the scroll indicator from overlapping the content.


##### Look to Scroll

In views that support Look to Scroll, people can scroll using only their eyes. Scrolling starts when people look near the boundary of the scroll view — along the top and bottom for vertical scroll views, or along the sides for horizontal scroll views. For example, a person can look at the bottom edge of a Safari window to scroll the page down, or look at an album on the trailing edge in the Music app to scroll it horizontally toward the center of the page. Look to Scroll works in conjunction with existing behavior, so someone can choose whether to use a gesture or their eyes to scroll. For developer guidance, see .

Support Look to Scroll for reading or browsing views. Because Look to Scroll doesn’t work by default, you need to add support for it to each individual scroll view. If your app contains reading or browsing views, add support for Look to Scroll to provide a comfortable and hands-free experience. For developer guidance, see .

Avoid using Look to Scroll for secondary content. In general, support standard gestures — but not Look to Scroll — in views that contain UI controls or dense information that requires quick, precise scrolling. For example, the Notes app offers Look to Scroll within the main view to let people easily read their content, but doesn’t support it for the list of notes.

Maintain consistency across content. If you support Look to Scroll for one view in your app, make sure to support it for all similar views. For example, if you offer several collection views of videos throughout your app, support Look to Scroll for each of these views so people know what to expect.

Define clear scroll areas within your app. In views that support Look to Scroll, prefer making the view the full width or full height of the window. This gives people generous space to scroll and provides clear edges. If you inset a scroll view from a window, like in the Notes app, provide clear boundaries so people know where to look.

If your app uses custom scroll effects or animations, remove them before supporting Look to Scroll. Custom effects that use scroll position to change content, such as parallax effects and animations, can cause Look to Scroll to behave unexpectedly.


#### watchOS

Prefer vertically scrolling content. People are accustomed to using the Digital Crown to navigate to and within apps on Apple Watch. If your app contains a single list or content view, rotating the Digital Crown scrolls vertically when your app’s content is taller than the height of the display.

Use tab views to provide page-by-page scrolling. watchOS displays tab views as pages. If you place tab views in a vertical stack, people can rotate the Digital Crown to move vertically through full-screen pages of content. In this scenario, the system displays a page indicator next to the Digital Crown that shows people where they are in the content, both within the current page and within a set of pages. For guidance, see .

When displaying paged content, consider limiting the content of an individual page to a single screen height. Embracing this constraint clarifies the purpose of each page, helping you create a more glanceable design. However, if your app has long pages, people can still use the Digital Crown both to navigate between shorter pages and to scroll content in a longer page because the page indicator expands into a scroll indicator when necessary. Use variable-height pages judiciously and place them after fixed-height pages when possible.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit

 — WatchKit

 — SwiftUI


### Change log

---

## Sheets

`/design/human-interface-guidelines/sheets`

_A sheet helps people perform a scoped task that’s closely related to their current context._

A sheet is useful for requesting specific information from people or presenting a simple task that they can complete before returning to the parent view. For example, a sheet might let people supply information needed to complete an action, such as attaching a file or choosing a location to save it.


### Anatomy

In macOS, tvOS, visionOS, and watchOS, a sheet is always modal. A modal sheet presents a targeted experience that prevents people from interacting with the parent view until they dismiss the sheet (for more on modal presentation, see ).

In iOS and iPadOS, a sheet can be either modal or nonmodal. When a nonmodal sheet is onscreen, people use its functionality to affect the parent view without dismissing the sheet. For example, Notes on iPhone and iPad uses a nonmodal sheet to let people format various text selections as they edit a note.

There are several common buttons that help people navigate through and dismiss sheets.

- The Cancel (or Close) button dismisses a sheet without saving any changes. This type of button is common in most sheets.

- The Done button dismisses a sheet after completing a task or explicitly saving changes.

- The Back button lets people navigate to a previous step in a multi-step flow or to a parent view in a hierarchy. It isn’t intended to dismiss a sheet.

The placement of these buttons varies between platforms; see .


### Best practices

For complex or prolonged user flows, consider alternatives to sheets. For example, iOS and iPadOS offer a full-screen style of modal view that can work well to display content like videos, photos, or camera views or to help people perform multistep tasks like document or photo editing. (For developer guidance, see .) In a macOS experience, you might want to open a new window or let people enter full-screen mode instead of using a sheet. For example, a self-contained task like editing a document tends to work well in a separate window, whereas  can help people view media. In visionOS, you can give people a way to transition your app to a Full Space where they can dive into content or a task; for guidance, see .

Display only one sheet at a time from the main interface. When people close a sheet, they expect to return to the parent view or window. If closing a sheet takes people back to another sheet, they can lose track of where they are in your app. If something people do within a sheet results in another sheet appearing, close the first sheet before displaying the new one. If necessary, you can display the first sheet again after people dismiss the second one.

Use a nonmodal view when you want to present supplementary items that affect the main task in the parent view. To give people access to information and actions they need while continuing to interact with the main window, consider using a  in visionOS or a  in macOS; in iOS and iPadOS, you can use a nonmodal sheet for this workflow. For guidance, see .

Provide an alternative to the Done button. If you provide a Done button, always pair it with a Cancel button to give people a clear way to dismiss the sheet without confirming or saving their changes, or a Back button to move to a previous step in the sheet. Relying solely on the Done button implies that completing the task is the only way to exit the sheet, which can feel restrictive or misleading.

Avoid showing all three buttons — Cancel, Done, and Back — together.


### Platform considerations

No additional considerations for tvOS.


#### iOS, iPadOS

In iOS and iPadOS, for sheets with a single view, the Cancel button belongs on the leading edge of the top toolbar. When present, the Done button belongs on the trailing edge.

For sheets with a multi-step flow, the placement of buttons can vary across steps.

A resizable sheet expands when people scroll its contents or drag the grabber, which is a small horizontal indicator that can appear at the top edge of a sheet. Sheets resize according to their detents, which are particular heights at which a sheet naturally rests. Designed for iPhone, detents specify particular heights at which a sheet naturally rests. The system defines two detents: large is the height of a fully expanded sheet and medium is about half of the fully expanded height. Sheets can have one or more custom detent values.

Sheets automatically support the large detent. Adding the medium detent allows the sheet to rest at both heights, whereas specifying only medium prevents the sheet from expanding to full height. For developer guidance, see .

In an iPhone app, consider supporting the medium detent to allow progressive disclosure of the sheet’s content. For example, a share sheet displays the most relevant items within the medium detent, where they’re visible without resizing. To view more items, people can scroll or expand the sheet. In contrast, you might not want to support the medium detent if a sheet’s content is more useful when it displays at full height. For example, the compose sheets in Messages and Mail display only at full height to give people enough room to create content.

Include a grabber in a resizable sheet. A grabber shows people that they can drag the sheet to resize it; they can also tap it to cycle through the detents. In addition to providing a visual indicator of resizability, a grabber also works with VoiceOver so people can resize the sheet without seeing the screen. For developer guidance, see .

Support swiping to dismiss a sheet. People expect to swipe vertically to dismiss a sheet instead of tapping a dismiss button. If people have unsaved changes in the sheet when they begin swiping to dismiss it, use an action sheet to let them confirm their action.

Prefer using the page or form sheet presentation styles in an iPadOS app. Each style uses a default size for the sheet, centering its content on top of a dimmed background view and providing a consistent experience. For developer guidance, see .


#### macOS

In macOS, a sheet is a cardlike view with rounded corners that floats on top of its parent window. The parent window is dimmed while the sheet is onscreen, signaling that people can’t interact with it until they dismiss the sheet. However, people expect to interact with other app windows before dismissing a sheet.

Present a sheet in a reasonable default size. People don’t generally expect to resize sheets, so it’s important to use a size that’s appropriate for the content you display. In some cases, however, people appreciate a resizable sheet — such as when they need to expand the contents for a clearer view — so it’s a good idea to support resizing.

Let people interact with other app windows without first dismissing a sheet. When a sheet opens, you bring its parent window to the front — if the parent window is a document window, you also bring forward its modeless document-related panels. When people want to interact with other windows in your app, make sure they can bring those windows forward even if they haven’t dismissed the sheet yet.

Use a panel instead of a sheet if people need to repeatedly provide input and observe results. A find and replace panel, for example, might let people initiate replacements individually, so they can observe the result of each search for correctness. For guidance, see .


#### visionOS

While a sheet is visible in a visionOS app, it floats in front of its parent window, dimming it, and becoming the target of people’s interactions with the app.

Avoid displaying a sheet that emerges from the bottom edge of a window. To help people view the sheet, prefer centering it in their .

Present a sheet in a default size that helps people retain their context. Avoid displaying a sheet that covers most or all of its window, but consider letting people resize the sheet if they want.


#### watchOS

In watchOS, a sheet is a full-screen view that slides over your app’s current content. The sheet is semitransparent to help maintain the current context, but the system applies a material to the background that blurs and desaturates the covered content.

Use a sheet only when your modal task requires a custom title or custom content presentation. If you need to give people important information or present a set of choices, consider using an  or .

Keep sheet interactions brief and occasional. Use a sheet only as a temporary interruption to the current workflow, and only to facilitate an important task. Avoid using a sheet to help people navigate your app’s content.

If you change the default label, prefer using SF Symbols to represent the action. Avoid using a label that might mislead people into thinking that the sheet is part of a hierarchical navigation interface. Also, if the text in the top-leading corner looks like a page or app title, people won’t know how to dismiss the sheet. For guidance, see .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Windows

`/design/human-interface-guidelines/windows`

_A window presents UI views and components in your app or game._

In iPadOS, macOS, and visionOS, windows help define the visual boundaries of app content and separate it from other areas of the system, and enable multitasking workflows both within and between apps. Windows include system-provided interface elements such as frames and window controls that let people open, close, resize, and relocate them.

Conceptually, apps use two types of windows to display content:

- A primary window presents the main navigation and content of an app, and actions associated with them.

- An auxiliary window presents a specific task or area in an app. Dedicated to one experience, an auxiliary window doesn’t allow navigation to other app areas, and it typically includes a button people use to close it after completing the task.

For guidance laying out content within a window on any platform, see ; for guidance laying out content in Apple Vision Pro space, see . For developer guidance, see .


### Best practices

Make sure that your windows adapt fluidly to different sizes to support multitasking and multiwindow workflows. For guidance, see  and .

Choose the right moment to open a new window. Opening content in a separate window is great for helping people multitask or preserve context. For example, Mail opens a new window whenever someone selects the Compose action, so both the new message and the existing email are visible at the same time. However, opening new windows excessively creates clutter and can make navigating your app more confusing. Avoid opening new windows as default behavior unless it makes sense for your app.

Consider providing the option to view content in a new window. While it’s best to avoid opening new windows as default behavior unless it benefits your user experience, it’s also great to give people the flexibility of viewing content in multiple ways. Consider letting people view content in a new window using a command in a  or in the . For developer guidance, see .

Avoid creating custom window UI. System-provided windows look and behave in a way that people understand and recognize. Avoid making custom window frames or controls, and don’t try to replicate the system-provided appearance. Doing so without perfectly matching the system’s look and behavior can make your app feel broken.

Use the term window in user-facing content. The system refers to app windows as windows regardless of type. Using different terms — including scene, which refers to window implementation — is likely to confuse people.


### Platform considerations

Not supported in iOS, tvOS, or watchOS.


#### iPadOS

Windows present in one of two ways depending on a person’s choice in Multitasking & Gestures settings.

- Full screen. App windows fill the entire screen, and people switch between them — or between multiple windows of the same app — using the app switcher.

- Windowed. People can freely resize app windows. Multiple windows can be onscreen at once, and people can reposition them and bring them to the front. The system remembers window size and placement even when an app is closed.

Make sure window controls don’t overlap toolbar items. When windowed, app windows include window controls at the leading edge of the toolbar. If your app has toolbar buttons at the leading edge, they might be hidden by window controls when they appear. To prevent this, instead of placing buttons directly on the leading edge, move them inward when the window controls appear.

Consider letting people use a gesture to open content in a new window. For example, people can use the pinch gesture to expand a Notes item into a new window. For developer guidance, see  (to transition from a collection view item), or  (to transition from an item in any other view).

> [TIP] If you only need to let people view one file, you can present it without creating your own window, but you must support multiple windows in your app. For developer guidance, see .


#### macOS

In macOS, people typically run several apps at the same time, often viewing windows from multiple apps on one desktop and switching frequently between different windows — moving, resizing, minimizing, and revealing the windows to suit their work style.

To learn about setting up a window to display your game in macOS, see .


##### macOS window anatomy

A macOS window consists of a frame and a body area. People can move a window by dragging the frame and can often resize the window by dragging its edges.

The frame of a window appears above the body area and can include window controls and a  . In rare cases, a window can also display a bottom bar, which is a part of the frame that appears below body content.


##### macOS window states

A macOS window can have one of three states:

- Main. The frontmost window that people view is an app’s main window. There can be only one main window per app.

- Key. Also called the active window, the key window accepts people’s input. There can be only one key window onscreen at a time. Although the front app’s main window is usually the key window, another window — such as a panel floating above the main window — might be key instead. People typically click a window to make it key; when people click an app’s Dock icon to bring all of that app’s windows forward, only the most recently accessed window becomes key.

- Inactive. A window that’s not in the foreground is an inactive window.

The system gives main, key, and inactive windows different appearances to help people visually identify them. For example, the key window uses color in the title bar options for closing, minimizing, and zooming; inactive windows and main windows that aren’t key use gray in these options. Also, inactive windows don’t use  (an effect that can pull color into a window from the content underneath it), which makes them appear subdued and seem visually farther away than the main and key windows.

> [NOTE] Some windows — typically, panels like Colors or Fonts — become the key window only when people click the window’s title bar or a component that requires keyboard input, such as a text field.

Make sure custom windows use the system-defined appearances. People rely on the visual differences between windows to help them identify the foreground window and know which window will accept their input. When you use system-provided components, a window’s background and button appearances update automatically when the window changes state; if you use custom implementations, you need to do this work yourself.

Avoid putting critical information or actions in a bottom bar, because people often relocate a window in a way that hides its bottom edge. If you must include one, use it only to display a small amount of information directly related to a window’s contents or to a selected item within it. For example, Finder uses a bottom bar (called the status bar) to display the total number of items in a window, the number of selected items, and how much space is available on the disk. A bottom bar is small, so if you have more information to display, consider using an inspector, which typically presents information on the trailing side of a split view.


#### visionOS

visionOS defines two main window styles: default and volumetric. Both a default window (called a window) and a volumetric window (called a volume) can display 2D and 3D content, and people can view multiple windows and volumes at the same time in both the Shared Space and a Full Space.

> [NOTE] visionOS also defines the plain window style, which is similar to the default style, except that the upright plane doesn’t use the glass background. For developer guidance, see .

The system defines the initial position of the first window or volume people open in your app or game. In both the Shared Space and a Full Space, people can move windows and volumes to new locations.


##### visionOS windows

The default window style consists of an upright plane that uses an unmodifiable background  called glass and includes a close button, window bar, and resize controls that let people close, move, and resize the window. A window can also include a Share button, , , and one or more . By default, visionOS uses dynamic  to help a window’s size appear to remain consistent regardless of its proximity to the viewer. For developer guidance, see .

Prefer using a window to present a familiar interface and to support familiar tasks. Help people feel at home in your app by displaying an interface they’re already comfortable with, reserving more  for the meaningful content and activities you offer. If you want to showcase bounded 3D content like a game board, consider using a .

Retain the window’s glass background. The default glass background helps your content feel like part of people’s surroundings while adapting dynamically to lighting and using specular reflections and shadows to communicate the window’s scale and position. Removing the glass material tends to cause UI elements and text to become less legible and to no longer appear related to each other; using an opaque background obscures people’s surroundings and can make a window feel constricting and heavy.

Choose an initial window size that minimizes empty areas within it. By default, a window measures 1280x720 pt. When a window first opens, the system places it about two meters in front of the wearer, giving it an apparent width of about three meters. Too much empty space inside a window can make it look unnecessarily large while also obscuring other content in people’s space.

Aim for an initial shape that suits a window’s content. For example, a default Keynote window is wide because slides are wide, whereas a default Safari window is tall because most webpages are much longer than they are wide. For games, a tower-building game is likely to open in a taller window than a driving game.

Choose a minimum and maximum size for each window to help keep your content looking great. People appreciate being able to resize windows as they customize their space, but you need to make sure your layout adjusts well across all sizes. If you don’t set a minimum and maximum size for a window, people could make it so small that UI elements overlap or so large that your app or game becomes unusable. For developer guidance, see .

Minimize the depth of 3D content you display in a window. The system adds highlights and shadows to the views and controls within a window, giving them the appearance of  and helping them feel more substantial, especially when people view the window from an angle. Although you can display 3D content in a window, the system clips it if the content extends too far from the window’s surface. To display 3D content that has greater depth, use a volume.


##### visionOS volumes

You can use a volume to display 2D or 3D content that people can view from any angle. A volume includes window-management controls just like a window, but unlike in a window, a volume’s close button and window bar shift position to face the viewer as they move around the volume. For developer guidance, see .

Prefer using a volume to display rich, 3D content. In contrast, if you want to present a familiar, UI-centric interface, it generally works best to use a .

Place 2D content so it looks good from multiple angles. Because a person’s perspective changes as they move around a volume, the location of 2D content within it might appear to change in ways that don’t make sense. To pin 2D content to specific areas of 3D content inside a volume, you can use an attachment.

In general, use dynamic scaling. Dynamic scaling helps a volume’s content remain comfortably legible and easy to interact with, even when it’s far away from the viewer. On the other hand, if you want a volume’s content to represent a real-world object, like a product in a retail app, you can use fixed scaling (this is the default).

Take advantage of the default baseplate appearance to help people discern the edges of a volume. In visionOS 2 and later, the system automatically makes a volume’s horizontal “floor,” or baseplate, visible by displaying a gentle glow around its border when people look at it. If your content doesn’t fill the volume, the system-provided glow can help people become aware of the volume’s edges, which can be particularly useful in keeping the resize control easy to find. On the other hand, if your content is full bleed or fills the volume’s bounds — or if you display a custom baseplate appearance — you may not want the default glow.

Consider offering high-value content in an ornament. In visionOS 2 and later, a volume can include an ornament in addition to a toolbar and tab bar. You can use an ornament to reduce clutter in a volume and elevate important views or controls. When you use an attachment anchor to specify the ornament’s location, such as `topBack` or `bottomFront`, the ornament remains in the same position, relative to the viewer’s perspective, as they move around the volume. Be sure to avoid placing an ornament on the same edge as a toolbar or tab bar, and prefer creating only one additional ornament to avoid overshadowing the important content in your volume. For developer guidance, see .

Choose an alignment that supports the way people interact with your volume. As people move a volume, the baseplate can remain parallel to the floor of a person’s surroundings, or it can tilt to match the angle at which a person is looking. In general, a volume that remains parallel to the floor works well for content that people don’t interact with much, whereas a volume that tilts to match where a person is looking can keep content comfortably usable, even when the viewer is reclining.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


##### Videos


### Change log

---

## Color wells

`/design/human-interface-guidelines/color-wells`

_A color well lets people adjust the color of text, shapes, guides, and other onscreen elements._

A color well displays a color picker when people tap or click it. This color picker can be the system-provided one or a custom interface that you design.


### Best practices

Consider the system-provided color picker for a familiar experience. Using the built-in color picker provides a consistent experience, in addition to letting people save a set of colors they can access from any app. The system-defined color picker can also help provide a familiar experience when developing apps across iOS, iPadOS, and macOS.


### Platform considerations

No additional considerations for iOS, iPadOS, or visionOS. Not supported in tvOS or watchOS.


#### macOS

When people click a color well, it receives a highlight to provide visual confirmation that it’s active. It then opens a color picker so people can choose a color. After they make a selection, the color well updates to show the new color.

Color wells also support drag and drop, so people can drag colors from one color well to another, and from the color picker to a color well.


### Resources


##### Related


##### Developer documentation

 — UIKit

 — UIKit

 — AppKit

---

## Combo boxes

`/design/human-interface-guidelines/combo-boxes`

_A combo box combines a text field with a pull-down button in a single control._

People can enter a custom value into the field or click the button to choose from a list of predefined values. When people enter a custom value, it’s not added to the list of choices.


### Best practices

Populate the field with a meaningful default value from the list. Although the field can be empty by default, it’s best when the default value refers to the hidden choices. The default value doesn’t have to be the first item in the list.

Use an introductory label to let people know what types of items to expect. Generally, use title-style capitalization for labels and end them with a colon. For related guidance, see .

Provide relevant choices. People appreciate the ability to enter a custom value, as well as the convenience of choosing from a list of the most likely choices.

Make sure list items aren’t wider than the text field. If an item is too wide, the text field might truncate it, which is hard for people to read.

For guidance, see  and .


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

---

## Digit entry views

`/design/human-interface-guidelines/digit-entry-views`

_A digit entry view fills the entire screen and prompts people to enter a series of digits, like a PIN, using a digit-specific keyboard._

You can add an optional title and prompt above the line of digits.


### Best practices

Use secure digit fields. Secure digit fields display asterisks instead of the entered digit onscreen. Always use a secure digit field when your app asks for sensitive data.

Clearly state the purpose of the digit entry view. Use a title and prompt that explains why someone needs to enter digits.


### Platform considerations

Not supported in iOS, iPadOS, macOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — TVUIKit

---

## Image wells

`/design/human-interface-guidelines/image-wells`

_An image well is an editable version of an image view._

After selecting an image well, people can copy and paste its image or delete it. People can also drag a new image into an image well without selecting it first.


### Best practices

Revert to a default image when necessary. If your image well requires an image, display the default image again if people clear the content of the image well.

If your image well supports copy and paste, make sure the standard copy and paste menu items are available. People generally expect to choose these menu items — or use the standard keyboard shortcuts — to interact with an image well. For guidance, see .

For related guidance, see .


### Platform considerations

Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit

---

## Pickers

`/design/human-interface-guidelines/pickers`

_A picker displays one or more scrollable lists of distinct values that people can choose from._

The system provides several styles of pickers, each of which offers different types of selectable values and has a different appearance. The exact values shown in a picker, and their order, depend on the device language.

Pickers help people enter information by letting them choose single or multipart values. Date pickers specifically offer additional ways to choose values, like selecting a day in a calendar view or entering dates and times using a numeric keypad.


### Best practices

Consider using a picker to offer medium-to-long lists of items. If you need to display a fairly short list of choices, consider using a  instead of a picker. Although a picker makes it easy to scroll quickly through many items, it may add too much visual weight to a short list of items. On the other hand, if you need to present a very large set of items, consider using a . Lists and tables can adjust in height, and tables can include an index, which makes it much faster to target a section of the list.

Use predictable and logically ordered values. Before people interact with a picker, many of its values can be hidden. It’s best when people can predict what the hidden values are, such as with an alphabetized list of countries, so they can move through the items quickly.

Avoid switching views to show a picker. A picker works well when displayed in context, below or in proximity to the field people are editing. A picker typically appears at the bottom of a window or in a popover.

Consider providing less granularity when specifying minutes in a date picker. By default, a minute list includes 60 values (0 to 59). You can optionally increase the minute interval as long as it divides evenly into 60. For example, you might want quarter-hour intervals (0, 15, 30, and 45).


### Platform considerations

No additional considerations for visionOS.


#### iOS, iPadOS

A date picker is an efficient interface for selecting a specific date, time, or both, using touch, a keyboard, or a pointing device. You can display a date picker in one of the following styles:

- Compact — A button that displays editable date and time content in a modal view.

- Inline — For time only, a button that displays wheels of values; for dates and times, an inline calendar view.

- Wheels — A set of scrolling wheels that also supports data entry through built-in or external keyboards.

- Automatic — A system-determined style based on the current platform and date picker mode.

A date picker has four modes, each of which presents a different set of selectable values.

- Date — Displays months, days of the month, and years.

- Time — Displays hours, minutes, and (optionally) an AM/PM designation.

- Date and time — Displays dates, hours, minutes, and (optionally) an AM/PM designation.

- Countdown timer — Displays hours and minutes, up to a maximum of 23 hours and 59 minutes. This mode isn’t available in the inline or compact styles.

The exact values shown in a date picker, and their order, depend on the device location.

Here are several examples of date pickers showing different combinations of style and mode.

Use a compact date picker when space is constrained. The compact style displays a button that shows the current value in your app’s accent color. When people tap the button, the date picker opens a modal view, providing access to a familiar calendar-style editor and time picker. Within the modal view, people can make multiple edits to dates and times before tapping outside the view to confirm their choices.


#### macOS

Choose a date picker style that suits your app. There are two styles of date pickers in macOS: textual and graphical. The textual style is useful when you’re working with limited space and you expect people to make specific date and time selections. The graphical style is useful when you want to give people the option of browsing through days in a calendar or selecting a range of dates, or when the look of a clock face is appropriate for your app.

For developer guidance, see .


#### tvOS

Pickers are available in tvOS with SwiftUI. For developer guidance, see .


#### watchOS

Pickers display lists of items that people navigate using the Digital Crown, which helps people manage selections in a precise and engaging way.

A picker can display a list of items using the wheels style. watchOS can also display date and time pickers using the wheels style. For developer guidance, see  and .

You can configure a picker to display an outline, caption, and scrolling indicator.

For longer lists, the navigation link displays the picker as a button. When someone taps the button, the system shows the list of options. The person can also scrub through the options using the Digital Crown without tapping the button. For developer guidance, see .


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — UIKit

 — AppKit


### Change log

---

## Segmented controls

`/design/human-interface-guidelines/segmented-controls`

_A segmented control is a linear set of two or more segments, each of which functions as a button._

Within a segmented control, all segments are usually equal in width. Like , segments can contain text or images. Segments can also have text labels beneath them (or beneath the control as a whole).

A segmented control offers a single choice from among a set of options, or in macOS, either a single choice or multiple choices. For example, in macOS Keynote people can select only one segment in the alignment options control to align selected text. In contrast, people can choose multiple segments in the font attributes control to combine styles like bold, italics, and underline. The toolbar of a Keynote window also uses a segmented control to let people show and hide various editing panes within the main window area.

In addition to representing the state of a single or multiple-choice selection, a segmented control can function as a set of buttons that perform actions without showing a selection state. For example, the Reply, Reply all, and Forward buttons in macOS Mail. For developer guidance, see  and .


### Best practices

Use a segmented control to provide closely related choices that affect an object, state, or view. For example, a segmented control in an inspector could let people choose one or more attributes to apply to a selection, or a segmented control in a toolbar could offer a set of actions to perform on the current view.

Consider a segmented control when it’s important to group functions together, or to clearly show their selection state. Unlike other button styles, segmented controls preserve their grouping regardless of the view size or where they appear. This grouping can also help people understand at a glance which controls are currently selected.

Keep control types consistent within a single segmented control. Don’t assign actions to segments in a control that otherwise represents selection state, and don’t show a selection state for segments in a control that otherwise performs actions.

Limit the number of segments in a control. Too many segments can be hard to parse and time-consuming to navigate. Aim for no more than about five to seven segments in a wide interface and no more than about five segments on iPhone.

In general, keep segment size consistent. When all segments have equal width, a segmented control feels balanced. To the extent possible, it’s best to keep icon and title widths consistent too.


### Content

Prefer using either text or images — not a mix of both — in a single segmented control. Although individual segments can contain text labels or images, mixing the two in a single control can lead to a disconnected and confusing interface.

As much as possible, use content with a similar size in each segment. Because all segments typically have equal width, it doesn’t look good if content fills some segments but not others.

Use nouns or noun phrases for segment labels. Write text that describes each segment and uses . A segmented control that displays text labels doesn’t need introductory text.


### Platform considerations

Not supported in watchOS.


#### iOS, iPadOS

Consider a segmented control to switch between closely related subviews. A segmented control can be useful as a way to quickly switch between related subviews. For example, the segmented control in Calendar’s New Event sheet switches between the subviews for creating a new event and a new reminder. For switching between completely separate sections of an app, use a  instead.


#### macOS

Consider using introductory text to clarify the purpose of a segmented control. When the control uses symbols or interface icons, you could also add a label below each segment to clarify its meaning. If your app includes tooltips, provide one for each segment in a segmented control.

Use a tab view in the main window area — instead of a segmented control — for view switching. A  supports efficient view switching and is similar in appearance to a  combined with a segmented control. Consider using a segmented control to help people switch views in a toolbar or inspector pane.

Consider supporting spring loading. On a Mac equipped with a Magic Trackpad, spring loading lets people activate a segment by dragging selected items over it and force clicking without dropping the selected items. People can also continue dragging the items after a segment activates.


#### tvOS

Consider using a split view instead of a segmented control on screens that perform content filtering. People generally find it easy to navigate back and forth between content and filtering options using a split view. Depending on its placement, a segmented control may not be as easy to access.

Avoid putting other focusable elements close to segmented controls. Segments become selected when focus moves to them, not when people click them. Carefully consider where you position a segmented control relative to other interface elements. If other focusable elements are too close, people might accidentally focus on them when attempting to switch between segments.


#### visionOS

When people look at a segmented control that uses icons, the system displays a tooltip that contains the descriptive text you supply.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Sliders

`/design/human-interface-guidelines/sliders`

_A slider is a horizontal track with a control, called a thumb, that people can adjust between a minimum and maximum value._

As a slider’s value changes, the portion of track between the minimum value and the thumb fills with color. A slider can optionally display left and right icons that illustrate the meaning of the minimum and maximum values.


### Best practices

Customize a slider’s appearance if it adds value. You can adjust a slider’s appearance — including track color, thumb image and tint color, and left and right icons — to blend with your app’s design and communicate intent. A slider that adjusts image size, for example, could show a small image icon on the left and a large image icon on the right.

Use familiar slider directions. People expect the minimum and maximum sides of sliders to be consistent in all apps, with minimum values on the leading side and maximum values on the trailing side (for horizontal sliders) and minimum values at the bottom and maximum values at the top (for vertical sliders). For example, people expect to be able to move a horizontal slider that represents a percentage from 0 percent on the leading side to 100 percent on the trailing side.

Consider supplementing a slider with a corresponding text field and stepper. Especially when a slider represents a wide range of values, people may appreciate seeing the exact slider value and having the ability to enter a specific value in a text field. Adding a stepper provides a convenient way for people to increment in whole values. For related guidance, see  and .


### Platform considerations

Not supported in tvOS.


#### iOS, iPadOS

Don’t use a slider to adjust audio volume. If you need to provide volume control in your app, use a volume view, which is customizable and includes a volume-level slider and a control for changing the active audio output device. For guidance, see .


#### macOS

Sliders in macOS can also include tick marks, making it easier for people to pinpoint a specific value within the range.

In a linear slider either with or without tick marks, the thumb is a narrow lozenge shape, and the portion of track between the minimum value and the thumb is filled with color. A linear slider often includes supplementary icons that illustrate the meaning of the minimum and maximum values.

In a circular slider, the thumb appears as a small circle. Tick marks, when present, appear as evenly spaced dots around the circumference of the slider.

Consider giving live feedback as the value of a slider changes. Live feedback shows people results in real time. For example, your Dock icons are dynamically scaled when adjusting the Size slider in Dock settings.

Choose a slider style that matches peoples’ expectations. A horizontal slider is ideal when moving between a fixed starting and ending point. For example, a graphics app might offer a horizontal slider for setting the opacity level of an object between 0 and 100 percent. Use circular sliders when values repeat or continue indefinitely. For example, a graphics app might use a circular slider to adjust the rotation of an object between 0 and 360 degrees. An animation app might use a circular slider to adjust how many times an object spins when animated — four complete rotations equals four spins, or 1440 degrees of rotation.

Consider using a label to introduce a slider. Labels generally use  and end with a colon. For guidance, see .

Use tick marks to increase clarity and accuracy. Tick marks help people understand the scale of measurements and make it easier to locate specific values.

Consider adding labels to tick marks for even greater clarity. Labels can be numbers or words, depending on the slider’s values. It’s unnecessary to label every tick mark unless doing so is needed to reduce confusion. In many cases, labeling only the minimum and maximum values is sufficient. When the values of the slider are nonlinear, like in the Energy Saver settings pane, periodic labels provide context. It’s also a good idea to provide a  that displays the value of the thumb when people hold their pointer over it.


#### visionOS

Prefer horizontal sliders. It’s generally easier for people to gesture from side to side than up and down.


#### watchOS

A slider is a horizontal track — appearing as a set of discrete steps or as a continuous bar — that represents a finite range of values. People can tap buttons on the sides of the slider to increase or decrease its value by a predefined amount.

If necessary, create custom glyphs to communicate what the slider does. The system displays plus and minus signs by default.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Steppers

`/design/human-interface-guidelines/steppers`

_A stepper is a two-segment control that people use to increase or decrease an incremental value._

A stepper sits next to a field that displays its current value, because the stepper itself doesn’t display a value.


### Best practices

Make the value that a stepper affects obvious. A stepper itself doesn’t display any values, so make sure people know which value they’re changing when they use a stepper.

Consider pairing a stepper with a text field when large value changes are likely. Steppers work well by themselves for making small changes that require a few taps or clicks. By contrast, people appreciate the option to use a field to enter specific values, especially when the values they use can vary widely. On a printing screen, for example, it can help to have both a stepper and a text field to set the number of copies.


### Platform considerations

No additional considerations for iOS, iPadOS, or visionOS. Not supported in watchOS or tvOS.


#### macOS

For large value ranges, consider supporting Shift-click to change the value quickly. If your app benefits from larger changes in a stepper’s value, it can be useful to let people Shift-click the stepper to change the value by more than the default increment (by 10 times the default, for example).


### Resources


##### Related


##### Developer documentation

 — UIKit

 — AppKit

---

## Text fields

`/design/human-interface-guidelines/text-fields`

_A text field is a rectangular area in which people enter or edit small, specific pieces of text._


### Best practices

Use a text field to request a small amount of information, such as a name or an email address. To let people input larger amounts of text, use a  instead.

Show a hint in a text field to help communicate its purpose. A text field can contain placeholder text — such as “Email” or “Password” — when there’s no other text in the field. Because placeholder text disappears when people start typing, it can also be useful to include a separate label describing the field to remind people of its purpose.

Use secure text fields to hide private data. Always use a secure text field when your app asks for sensitive data, such as a password. For developer guidance, see .

To the extent possible, match the size of a text field to the quantity of anticipated text. The size of a text field helps people visually gauge the amount of information to provide.

Evenly space multiple text fields. If your layout includes multiple text fields, leave enough space between them so people can easily see which input field belongs with each introductory label. Stack multiple text fields vertically when possible, and use consistent widths to create a more organized layout. For example, the first and last name fields on an address form might be one width, while the address and city fields might be a different width.

Ensure that tabbing between multiple fields flows as people expect. When tabbing between fields, move focus in a logical sequence. The system attempts to achieve this result automatically, so you won’t need to customize this too often.

Validate fields when it makes sense. For example, if the only legitimate value for a field is a string of digits, your app needs to alert people if they’ve entered characters other than digits. The appropriate time to check the data depends on the context: when entering an email address, it’s best to validate when people switch to another field; when creating a user name or password, validation needs to happen before people switch to another field.

Use a number formatter to help with numeric data. A number formatter automatically configures the text field to accept only numeric values. It can also display the value in a specific way, such as with a certain number of decimal places, as a percentage, or as currency. Don’t assume the actual presentation of data, however, as formatting can vary significantly based on people’s locale.

Adjust line breaks according to the needs of the field. By default, the system clips any text extending beyond the bounds of a text field. Alternatively, you can set up a text field to wrap text to a new line at the character or word level, or to truncate (indicated by an ellipsis) at the beginning, middle, or end.

Consider using an expansion tooltip to show the full version of clipped or truncated text. An expansion tooltip behaves like a regular  and appears when someone places the pointer over the field.

In iOS, iPadOS, tvOS, and visionOS apps, show the appropriate keyboard type. Several different keyboard types are available, each designed to facilitate a different type of input, such as numbers or URLs. To streamline data entry, display the keyboard that’s appropriate for the type of content people are entering. For guidance, see .

Minimize text entry in your tvOS and watchOS apps. Entering long passages of text or filling out numerous text fields is time-consuming on Apple TV and Apple Watch. Minimize text input and consider gathering information more efficiently, such as with buttons.


### Platform considerations

No additional considerations for tvOS or visionOS.


#### iOS, iPadOS

Display a Clear button in the trailing end of a text field to help people erase their input. When this element is present, people can tap it to clear the text field’s contents, without having to keep tapping the Delete key.

Use images and buttons to provide clarity and functionality in text fields. You can display custom images in both ends of a text field, or you can add a system-provided button, such as the Bookmarks button. In general, use the leading end of a text field to indicate a field’s purpose and the trailing end to offer additional features, such as bookmarking.


#### macOS

Consider using a combo box if you need to pair text input with a list of choices. For related guidance, see .


#### watchOS

Present a text field only when necessary. Whenever possible, prefer displaying a list of options rather than requiring text entry.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit

 — AppKit


### Change log

---

## Toggles

`/design/human-interface-guidelines/toggles`

_A toggle lets people choose between a pair of opposing states, like on and off, using a different appearance to indicate each state._

A toggle can have various styles, such as switch and checkbox, and different platforms can use these styles in different ways. For guidance, see .

In addition to toggles, all platforms also support buttons that behave like toggles by using a different appearance for each state. For developer guidance, see .


### Best practices

Use a toggle to help people choose between two opposing values that affect the state of content or a view. A toggle always lets people manage the state of something, so if you need to support other types of actions — such as choosing from a list of items — use a different component, like a .

Clearly identify the setting, view, or content the toggle affects. In general, the surrounding context provides enough information for people to understand what they’re turning on or off. In some cases, often in macOS apps, you can also supply a label to describe the state the toggle controls. If you use a button that behaves like a toggle, you generally use an interface icon that communicates its purpose, and you update its appearance — typically by changing the background — based on the current state.

Make sure the visual differences in a toggle’s state are obvious. For example, you might add or remove a color fill, show or hide the background shape, or change the inner details you display — like a checkmark or dot — to show that a toggle is on or off. Avoid relying solely on different colors to communicate state, because not everyone can perceive the differences.


### Platform considerations

No additional considerations for tvOS, visionOS, or watchOS.


#### iOS, iPadOS

Use the switch toggle style only in a list row. You don’t need to supply a label in this situation because the content in the row provides the context for the state the switch controls.

Change the default color of a switch only if necessary. The default green color tends to work well in most cases, but you might want to use your app’s accent color instead. Be sure to use a color that provides enough contrast with the uncolored appearance to be perceptible.

Outside of a list, use a button that behaves like a toggle, not a switch. For example, the Phone app uses a toggle on the filter button to let users filter their recent calls.  The app adds a blue highlight to indicate when the toggle is active, and removes it when the toggle is inactive.

Avoid supplying a label that explains the button’s purpose. The interface icon you create — combined with the alternative background appearances you supply — help people understand what the button does. For developer guidance, see .


#### macOS

In addition to the switch toggle style, macOS supports the checkbox style and also defines radio buttons that can provide similar behaviors.

Use switches, checkboxes, and radio buttons in the window body, not the window frame. In particular, avoid using these components in a toolbar or status bar.


##### Switches

Prefer a switch for settings that you want to emphasize. A switch has more visual weight than a checkbox, so it looks better when it controls more functionality than a checkbox typically does. For example, you might use a switch to let people turn on or off a group of settings, instead of just one setting. For developer guidance, see .

Within a grouped form, consider using a mini switch to control the setting in a single row. The height of a mini switch is similar to the height of buttons and other controls, resulting in rows that have a consistent height. If you need to present a hierarchy of settings within a grouped form, you can use a regular switch for the primary setting and mini switches for the subordinate settings. For developer guidance, see  and .

In general, don’t replace a checkbox with a switch. If you’re already using a checkbox in your interface, it’s probably best to keep using it.


##### Checkboxes

A checkbox is a small, square button that’s empty when the button is off, contains a checkmark when the button is on, and can contain a dash when the button’s state is mixed. Typically, a checkbox includes a title on its trailing side. In an editable checklist, a checkbox can appear without a title or any additional content.

Use a checkbox instead of a switch if you need to present a hierarchy of settings. The visual style of checkboxes helps them align well and communicate grouping. By using alignment — generally along the leading edge of the checkboxes — and indentation, you can show dependencies, such as when the state of a checkbox governs the state of subordinate checkboxes.

Consider using radio buttons if you need to present a set of more than two mutually exclusive options. When people need to choose from options in addition to just “on” or “off,” using multiple radio buttons can help you clarify each option with a unique label.

Consider using a label to introduce a group of checkboxes if their relationship isn’t clear. Describe the set of options, and align the label’s baseline with the first checkbox in the group.

Accurately reflect a checkbox’s state in its appearance. A checkbox’s state can be on, off, or mixed. If you use a checkbox to globally turn on and off multiple subordinate checkboxes, show a mixed state when the subordinate checkboxes have different states. For example, you might need to present a text-style setting that turns all styles on or off, but also lets people choose a subset of individual style settings like bold, italic, or underline. For developer guidance, see .


##### Radio buttons

A radio button is a small, circular button followed by a label. Typically displayed in groups of two to five, radio buttons present a set of mutually exclusive choices.

A radio button’s state is either selected (a filled circle) or deselected (an empty circle). Although a radio button can also display a mixed state (indicated by a dash), this state is rarely useful because you can communicate multiple states by using additional radio buttons. If you need to show that a setting or item has a mixed state, consider using a checkbox instead.

Prefer a set of radio buttons to present mutually exclusive options. If you need to let people choose multiple options in a set, use checkboxes instead.

Avoid listing too many radio buttons in a set. A long list of radio buttons takes up a lot of space in the interface and can be overwhelming. If you need to present more than about five options, consider using a component like a  instead.

To present a single setting that can be on or off, prefer a checkbox. Although a single radio button can also turn something on or off, the presence or absence of the checkmark in a checkbox can make the current state easier to understand at a glance. In rare cases where a single checkbox doesn’t clearly communicate the opposing states, you can use a pair of radio buttons, each with a label that specifies the state it controls.

Use consistent spacing when you display radio buttons horizontally. Measure the space needed to accommodate the longest button label, and use that measurement consistently.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — UIKit

 — AppKit

 — AppKit


### Change log

---

## Virtual keyboards

`/design/human-interface-guidelines/virtual-keyboards`

_On devices without physical keyboards, the system offers various types of virtual keyboards people can use to enter data._

A virtual keyboard can provide a specific set of keys that are optimized for the current task; for example, a keyboard that supports entering email addresses can include the “@” character and a period or even “.com”.  A virtual keyboard doesn’t support keyboard shortcuts.

When it makes sense in your app, you can replace the system-provided keyboard with a custom view that supports app-specific data entry.  In iOS, iPadOS, and tvOS, you can also create an app extension that offers a custom keyboard people can install and use in place of the standard keyboard.


### Best practices

Choose a keyboard that matches the type of content people are editing. For example, you can help people enter numeric data by providing the numbers and punctuation keyboard. When you specify a semantic meaning for a text input area, the system can automatically provide a keyboard that matches the type of input you expect, potentially using this information to refine the keyboard corrections it offers. For developer guidance, see  (SwiftUI), (SwiftUI),  (UIKit), and  (UIKit).

Consider customizing the Return key type if it helps clarify the text-entry experience. The Return key type is based on the keyboard type you choose, but you can change this if it makes sense in your app. For example, if your app initiates a search, you can use a search Return key type rather than the standard one so the experience is consistent with other places people initiate search. For developer guidance, see  (SwiftUI) and  (UIKit).


### Custom input views

In some cases, you can create an input view if you want to provide custom functionality that enhances data-entry tasks in your app. For example, Numbers provides a custom input view for entering numeric values while editing a spreadsheet. A custom input view replaces the system-provided keyboard while people are in your app. For developer guidance, see  (SwiftUI) and  (UIKit).

Make sure your custom input view makes sense in the context of your app. In addition to making data entry simple and intuitive, you want people to understand the benefits of using your custom input view. Otherwise, they may wonder why they can’t regain the system keyboard while in your app.

Play the standard keyboard sound while people type. The keyboard sound provides familiar feedback when people tap a key on the system keyboard, so they’re likely to expect the same sound when they tap keys in your custom input view. People can turn keyboard sounds off for all keyboard interactions in Settings > Sounds. For developer guidance, see  (UIKit).


### Custom keyboards

In iOS, iPadOS, and tvOS, you can provide a custom keyboard that replaces the system keyboard by creating an app extension. An app extension is code you provide that people can install and use to extend the functionality of a specific area of the system; to learn more, see .

After people choose your custom keyboard in Settings, they can use it for text entry within any app, except when editing secure text fields and phone number fields. People can choose multiple custom keyboards and switch between them at any time. For developer guidance, see .

Custom keyboards make sense when you want to expose unique keyboard functionality systemwide, such as a novel way of inputting text or the ability to type in a language the system doesn’t support. If you want to provide a custom keyboard for people to use only while they’re in your app, consider creating a custom input view instead.

Provide an obvious and easy way to switch between keyboards. People know that the Globe key on the standard keyboard — which replaces the dedicated Emoji key when multiple keyboards are available — quickly switches to other keyboards, and they expect a similarly intuitive experience in your keyboard.

Avoid duplicating system-provided keyboard features. On some devices, the Emoji/Globe key and Dictation key automatically appear beneath the keyboard, even when people are using custom keyboards. Your app can’t affect these keys, and it’s likely to be confusing if you repeat them in your keyboard.

Consider providing a keyboard tutorial in your app. People are used to the standard keyboard, and learning how to use a new keyboard can take time. You can help make the process easier by providing usage instructions in your app — for example, you might tell people how to choose your keyboard, activate it during text entry, use it, and switch back to the standard keyboard. Avoid displaying help content within the keyboard itself.


### Platform considerations

Not supported in macOS.


#### iOS, iPadOS

Use the keyboard layout guide to make the keyboard feel like an integrated part of your interface. Using the layout guide also helps you keep important parts of your interface visible while the virtual keyboard is onscreen. For developer guidance, see .

Place custom controls above the keyboard thoughtfully. Some apps position an input accessory view containing custom controls above the keyboard to offer app-specific functionality related to the data people are working with. For example, Numbers displays controls that help people apply standard or custom calculations to spreadsheet data. If your app offers custom controls that augment the keyboard, make sure they’re relevant to the current task. If other views in your app use Liquid Glass, or if your view looks out of place above the keyboard, apply Liquid Glass to the view that contains your controls to maintain consistency. If you use a standard toolbar to contain your controls, it automatically adopts Liquid Glass. Use the keyboard layout guide and standard padding to ensure the system positions your controls as expected within the view. For developer guidance, see  (SwiftUI),  (UIKit), and  (UIKit).


#### tvOS

tvOS displays a linear virtual keyboard when people select a text field using the Siri Remote.

> [NOTE] A grid keyboard screen appears when people use devices other than the Siri Remote, and the layout of content automatically adapts to the keyboard.

When people activate a digit entry view, tvOS displays a digit-specific keyboard. For guidance, see .


#### visionOS

In visionOS, the system-provided virtual keyboard supports both direct and indirect gestures and appears in a separate window that people can move where they want. You don’t need to account for the location of the keyboard in your layouts.


#### watchOS

On Apple Watch, a text field can show a keyboard if the device screen is large enough. Otherwise, the system lets people use dictation or Scribble to enter information. You can’t change the keyboard type in watchOS, but you can set the content type of the text field. The system uses this information to make text entry easier, such as by offering suggestions. For developer guidance, see  (SwiftUI).

People can also use a nearby paired iPhone to enter text on Apple Watch.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — SwiftUI

 — UIKit


### Change log

---

## Activity rings

`/design/human-interface-guidelines/activity-rings`

_Activity rings show an individual’s daily progress toward Move, Exercise, and Stand goals._

In watchOS, the Activity ring element always contains three rings, whose colors and meanings match those the Activity app provides. In iOS, the Activity ring element contains either a single Move ring representing an approximation of activity, or all three rings if an Apple Watch is paired.


### Best practices

Display Activity rings when they’re relevant to the purpose of your app. If your app is related to health or fitness, and especially if it contributes information to HealthKit, people generally expect to find Activity rings in your interface. For example, if you structure a workout or health session around the completion of Activity rings, consider displaying the element on a workout metrics screen so that people can track their progress during their session. Similarly, if you provide a summary screen that appears at the conclusion of a workout, you could display Activity rings to help people check on their progress toward their daily goals.

Use Activity rings only to show Move, Exercise, and Stand information. Activity rings are designed to consistently represent progress in these specific areas. Don’t replicate or modify Activity rings for other purposes. Never use Activity rings to display other types of data. Never show Move, Exercise, and Stand progress in another ring-like element.

Use Activity rings to show progress for a single person. Never use Activity rings to represent data for more than one person, and make sure it’s obvious whose progress you’re showing by using a label, a photo, or an avatar.

Always keep the visual appearance of Activity rings the same, regardless of where you display them. Follow these guidelines to provide a consistent experience:

- Never change the colors of the rings; for example, don’t use filters or modify opacity.

- Always display Activity rings on a black background.

- Prefer enclosing the rings and background within a circle. To do this, adjust the corner radius of the enclosing view rather than applying a circular mask.

- Ensure that the black background remains visible around the outermost ring. If necessary, add a thin, black stroke around the outer edge of the ring, and avoid including a gradient, shadow, or any other visual effect.

- Always scale the rings appropriately so they don’t seem disconnected or out of place.

- When necessary, design the surrounding interface to blend with the rings; never change the rings to blend with the surrounding interface.

To display a label or value that’s directly associated with an Activity ring, use the colors that match it. To display the ring-specific labels Move, Exercise, and Stand, or to display a person’s current and goal values for each ring, use the following colors, specified as RGB values.

Maintain Activity ring margins. An Activity ring element must include a minimum outer margin of no less than the distance between rings. Never allow other elements to crop, obstruct, or encroach upon this margin or the rings themselves.

Differentiate other ring-like elements from Activity rings. Mixing different ring styles can lead to a visually confusing interface. If you must include other rings, use padding, lines, or labels to separate them from Activity rings. Color and scale can also help provide visual separation.

Don’t send notifications that repeat the same information the Activity app sends. The system already delivers Move, Exercise, and Stand progress updates, so it’s confusing for people to receive redundant information from your app. Also, don’t show an Activity ring element in your app’s notifications. It’s fine to reference Activity progress in a notification, but do so in a way that’s unique to your app and doesn’t replicate the same information the system provides.

Don’t use Activity rings for decoration. Activity rings provide information to people; they don’t just embellish your app’s design. Never display Activity rings in labels or background graphics.

Don’t use Activity rings for branding. Use Activity rings strictly to display Activity progress in your app. Never use Activity rings in your app’s icon or marketing materials.


### Platform considerations

No additional considerations for iPadOS or watchOS. Not supported in macOS, tvOS, or visionOS.


#### iOS

Activity rings are available in iOS with . The appearance of the Activity ring element changes automatically depending on whether an Apple Watch is paired:

- With an Apple Watch paired, iOS shows all three Activity rings.

- Without an Apple Watch paired, iOS shows the Move ring only, which represents an approximation of a person’s activity based on their steps and workout information from other apps.

Because iOS shows Activity rings whether or not an Apple Watch is paired, activity history can include a combination of both styles. For example, Activity rings in Fitness have three rings when a person exercises with their Apple Watch paired, and only the Move ring when they exercise without their Apple Watch.


### Resources


##### Related


##### Developer documentation

 — HealthKit


##### Videos


### Change log

---

## Gauges

`/design/human-interface-guidelines/gauges`

_A gauge displays a specific numerical value within a range of values._

In addition to indicating the current value in a range, a gauge can provide more context about the range itself. For example, a temperature gauge can use text to identify the highest and lowest temperatures in the range and display a spectrum of colors that visually reinforce the changing values.


### Anatomy

A gauge uses a circular or linear path to represent a range of values, mapping the current value to a specific point on the path. A standard gauge displays an indicator that shows the current value’s location; a gauge that uses the capacity style displays a fill that stops at the value’s location on the path.

Circular and linear gauges in both standard and capacity styles are also available in a variant that’s visually similar to watchOS complications. This variant — called accessory — works well in iOS Lock Screen widgets and anywhere you want to echo the appearance of complications.

> [NOTE] In addition to gauges, macOS also supports level indicators, some of which have visual styles that are similar to gauges. For guidance, see .


### Best practices

Write succinct labels that describe the current value and both endpoints of the range. Although not every gauge style displays all labels, VoiceOver reads the visible labels to help people understand the gauge without seeing the screen.

Consider filling the path with a gradient to help communicate the purpose of the gauge. For example, a temperature gauge might use colors that range from red to blue to represent temperatures that range from hot to cold.


### Platform considerations

No additional considerations for iOS, iPadOS, visionOS, or watchOS. Not supported in tvOS.


#### macOS

In addition to supporting gauges, macOS also defines a level indicator that displays a specific numerical value within a range. You can configure a level indicator to convey capacity, rating, or — rarely — relevance.

The capacity style can depict discrete or continuous values.

Consider using the continuous style for large ranges. A large value range can make the segments of a discrete capacity indicator too small to be useful.

Consider changing the fill color to inform people about significant parts of the range. By default, the fill color for both capacity indicator styles is green. If it makes sense in your app, you can change the fill color when the current value reaches certain levels, such as very low, very high, or just past the middle. You can change the fill color of the entire indicator or you can use the tiered state to show a sequence of several colors in one indicator, as shown below.

For guidance using the rating style to help people rank something, see .

Although rarely used, the relevance style can communicate relevancy using a shaded horizontal bar. For example, a relevance indicator might appear in a list of search results, helping people visualize the relevancy of the results when sorting or comparing multiple items.


### Resources


##### Related


##### Developer documentation

 — SwiftUI

 — AppKit


### Change log

---

## Progress indicators

`/design/human-interface-guidelines/progress-indicators`

_Progress indicators let people know that your app isn’t stalled while it loads content or performs lengthy operations._

Some progress indicators also give people a way to estimate how long they have to wait for something to complete. All progress indicators are transient, appearing only while an operation is ongoing and disappearing after it completes.

Because the duration of an operation is either known or unknown, there are two types of progress indicators:

- Determinate, for a task with a well-defined duration, such as a file conversion

- Indeterminate, for unquantifiable tasks, such as loading or synchronizing complex data

Both determinate and indeterminate progress indicators can have different appearances depending on the platform. A determinate progress indicator shows the progress of a task by filling a linear or circular track as the task completes. Progress bars include a track that fills from the leading side to the trailing side. Circular progress indicators have a track that fills in a clockwise direction.

An indeterminate progress indicator — also called an activity indicator — uses an animated image to indicate progress. All platforms support a circular image that appears to spin; however, macOS also supports an indeterminate progress bar.

For developer guidance, see .


### Best practices

When possible, use a determinate progress indicator. An indeterminate progress indicator shows that a process is occurring, but it doesn’t help people estimate how long a task will take. A determinate progress indicator can help people decide whether to do something else while waiting for the task to complete, restart the task at a different time, or abandon the task.

Be as accurate as possible when reporting advancement in a determinate progress indicator. Consider evening out the pace of advancement to help people feel confident about the time needed for the task to complete. Showing 90 percent completion in five seconds and the last 10 percent in 5 minutes can make people wonder if your app is still working and can even feel deceptive.

Keep progress indicators moving so people know something is continuing to happen. People tend to associate a stationary indicator with a stalled process or a frozen app. If a process stalls for some reason, provide feedback that helps people understand the problem and what they can do about it.

When possible, switch a progress bar from indeterminate to determinate. If an indeterminate process reaches a point where you can determine its duration, switch to a determinate progress bar. People generally prefer a determinate progress indicator, because it helps them gauge what’s happening and how long it will take.

Don’t switch from the circular style to the bar style. Activity indicators (also called spinners) and progress bars are different shapes and sizes, so transitioning between them can disrupt your interface and confuse people.

If it’s helpful, display a description that provides additional context for the task. Be accurate and succinct. Avoid vague terms like loading or authenticating because they seldom add value.

Display a progress indicator in a consistent location. Choosing a consistent location for a progress indicator helps people reliably find the status of an operation across platforms or within or between apps.

When it’s feasible, let people halt processing. If people can interrupt a process without causing negative side effects, include a Cancel button. If interrupting the process might cause negative side effects — such as losing the downloaded portion of a file — it can be useful to provide a Pause button in addition to a Cancel button.

Let people know when halting a process has a negative consequence. When canceling a process results in lost progress, it’s helpful to provide an  that includes an option to confirm the cancellation or resume the process.


### Platform considerations

No additional considerations for tvOS or visionOS.


#### iOS, iPadOS


##### Refresh content controls

A refresh control lets people immediately reload content, typically in a table view, without waiting for the next automatic content update to occur. A refresh control is a specialized type of activity indicator that’s hidden by default, becoming visible when people drag down the view they want to reload. In Mail, for example, people can drag down the list of Inbox messages to check for new messages.

Perform automatic content updates. Although people appreciate being able to do an immediate content refresh, they also expect automatic refreshes to occur periodically. Don’t make people responsible for initiating every update. Keep data fresh by updating it regularly.

Supply a short title only if it adds value. Optionally, a refresh control can include a title. In most cases, this is unnecessary, as the animation of the control indicates that content is loading. If you do include a title, don’t use it to explain how to perform a refresh. Instead, provide information of value about the content being refreshed. A refresh control in Podcasts, for example, uses a title to tell people when the last podcast update occurred.

For developer guidance, see .


#### macOS

In macOS, an indeterminate progress indicator can have a bar or circular appearance. Both versions use an animated image to indicate that the app is performing a task.

Prefer an activity indicator (spinner) to communicate the status of a background operation or when space is constrained. Spinners are small and unobtrusive, so they’re useful for asynchronous background tasks, like retrieving messages from a server. Spinners are also good for communicating progress within a small area, such as within a text field or next to a specific control, such as a button.

Avoid labeling a spinning progress indicator. Because a spinner typically appears when people initiate a process, a label is usually unnecessary.


#### watchOS

By default the system displays the progress indicators in white over the scene’s background color. You can change the color of the progress indicator by setting its tint color.


### Resources


##### Developer documentation

 — SwiftUI

 — UIKit

 — UIKit

 — UIKit

 — AppKit


### Change log

---

## Rating indicators

`/design/human-interface-guidelines/rating-indicators`

_A rating indicator uses a series of horizontally arranged graphical symbols — by default, stars — to communicate a ranking level._

A rating indicator doesn’t display partial symbols; it rounds the value to display complete symbols only. Within a rating indicator, symbols are always the same distance apart and don’t expand or shrink to fit the component’s width.


### Best practices

Make it easy to change rankings. When presenting a list of ranked items, let people adjust the rank of individual items inline without navigating to a separate editing screen.

If you replace the star with a custom symbol, make sure that its purpose is clear. The star is a very recognizable ranking symbol, and people may not associate other symbols with a rating scale.


### Platform considerations

No additional considerations for macOS.  Not supported in iOS, iPadOS, tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation

 — AppKit


### Change log

---

## App Shortcuts

`/design/human-interface-guidelines/app-shortcuts`

_An App Shortcut gives people access to your app’s key functions or content throughout the system._

People can initiate App Shortcuts using features like Siri, Spotlight, and the Shortcuts app; using hardware features like the  on iPhone or Apple Watch; or by  Apple Pencil.

Because App Shortcuts are part of your app, they are available immediately when installation finishes. For example, a journaling app could offer an App Shortcut for making a new journal entry that’s available before a person opens the app for the first time. Once someone starts using your app, its App Shortcuts can reflect their choices, like those from FaceTime for calling recent contacts.

App Shortcuts use  to define actions within your app to make available to the system. Each App Shortcut includes one or more actions that represent a set of steps people might want to perform to accomplish a task. For example, a home security app might combine the two common actions of turning off the lights and locking exterior doors when a person goes to sleep at night into a single App Shortcut. Each app can include up to 10 App Shortcuts.

For developer guidance, see .

> [NOTE] When you use App Intents to make your app’s actions available to the system, in addition to the App Shortcuts that your app provides, people can also make their own custom shortcuts by combining actions in the Shortcuts app. Custom shortcuts give people flexibility to configure the behavior of actions, and enable workflows that perform tasks across multiple apps. For additional guidance, see the .


### Best practices

To surface common types of app functionality throughout the system, consider adopting app schemas instead. Apps in common domain areas can adopt  to make their actions and content available to Apple Intelligence. On supported devices, this lets Siri and other system experiences surface app features contextually without the need to adopt individual App Shortcuts. For guidance, see . For developer guidance, see  and .

App Shortcuts are useful for exposing unique features or custom content to the system in areas not covered by app schemas.

Offer App Shortcuts for your app’s most common and important tasks. Straightforward tasks that people can complete without leaving their current context work best, but you can also open your app if it helps people complete multistep tasks more easily.

Add flexibility by letting people choose from a set of options. An App Shortcut can include a single optional value, or parameter, if it makes sense. For example, a meditation app could offer an App Shortcut that lets someone begin a specific type of meditation: “Start [morning, daily, sleep] meditation.” Include predictable and familiar values as options, because people won’t have the list in front of them for reference. For developer guidance, see .

Ask for clarification in response to a request that’s missing optional information. For example, someone might say “Start meditation” without specifying the type (morning, daily, or sleep); you could follow up by suggesting the one they used most recently, or one based on the current time of day. If one option is most likely, consider presenting it as the default, and provide a short list of alternatives to choose from if a person doesn’t want the default choice.

Keep voice interactions simple. If your phrase feels too complicated when you say it aloud, it’s probably too difficult to remember or say correctly. For example, “Start [sleep] meditation with nature sounds” appears to have two possible parameters: the meditation type, and the accompanying sound. If additional information is absolutely required, ask for it in a subsequent step. For additional guidance on writing dialogue text for voice interactions, see .

Make App Shortcuts discoverable in your app. People are most likely to remember and use App Shortcuts for tasks they do often, once they know the shortcut is available. Consider showing occasional tips in your app when people perform common actions to let them know an App Shortcut exists. For developer guidance, see .


#### Responding to App Shortcuts

As a person engages with an App Shortcut, your app can respond in a variety of ways, including with dialogue that Siri speaks aloud and custom visuals like snippets and Live Activities.

-  are great for custom views that display static information or dialog options, like showing the weather at a person’s location or confirming an order. For developer guidance, see .

-  offer continuous access to information that’s likely to remain relevant and change over a period of time, and are great for timers and countdowns that appear until an event is complete. For developer guidance, see .

Provide enough detail for interaction on audio-only devices. People can receive responses on audio-only devices such as AirPods and HomePod too, and may not always be able to see content onscreen. Include all critical information in the full dialogue text of your App Shortcuts. For developer guidance, see .


### Editorial guidelines

Provide brief, memorable activation phrases and natural variants. Because an App Shortcut phrase (or a variant you define) is what people say to run an App Shortcut with Siri, it’s important to keep it brief to make it easier to remember. You have to include your app name, but you can be creative with it. For example, Keynote accepts both “Create a Keynote” and “Add a new presentation in Keynote” as App Shortcut phrases for creating a new document. For developer guidance, see .

When referring to App Shortcuts or the Shortcuts app, always use title case and make sure that Shortcuts is plural. For example, MyApp integrates with Shortcuts to provide a quick way to get things done with just a tap or by asking Siri, and offers App Shortcuts you can place on the Action button.

When referring to individual shortcuts (not App Shortcuts or the Shortcuts app), use lowercase. For example, Run a shortcut by asking Siri or tapping a suggestion on the Lock Screen.


### Platform considerations

No additional considerations for visionOS or watchOS. Not supported in tvOS.


#### iOS, iPadOS

App Shortcuts can appear in the Top Hit area of Spotlight when people search for your app, or in the Shortcuts area below. Each App Shortcut includes a symbol from  that you choose to represent its functionality, or a preview image of an item that the shortcut links to directly.

Order shortcuts based on importance. The order you choose determines how App Shortcuts initially appear in both Spotlight and the Shortcuts app, so it’s helpful to include the most generally useful ones first. Once people start using your App Shortcuts, the system updates to prioritize the ones they use most frequently.


#### macOS

App Shortcuts aren’t supported in macOS. However, actions you create for your app using App Intents are supported, and people can build custom shortcuts using them with the Shortcuts app on Mac.


### Resources


##### Related


##### Developer documentation

 — App Intents

 — App Intents


##### Videos


### Change log

---

## Complications

`/design/human-interface-guidelines/complications`

_A complication displays timely, relevant information on the watch face, where people can view it each time they raise their wrist._

People often prefer apps that provide multiple, powerful complications, because it gives them quick ways to view the data they care about, even when they don’t open the app.

Most watch faces can display at least one complication; some can display four or more.

Starting in watchOS 9, the system organizes complications (also known as accessories) into several families — like  and  — and defines some recommended layouts you can use to display your complication data. A watch face can specify the family it supports in each complication slot. Complications that work in earlier versions of watchOS can use the , which define nongraphic complication styles that don’t take on a wearer’s selected color.

> [NOTE] Prefer using  to develop complications for watchOS 9 and later. For guidance, see . To support earlier versions of watchOS, continue to implement the ClockKit complication data source protocol (see ).


### Best practices

Identify essential, dynamic content that people want to view at a glance. Although people can use a complication to quickly launch an app, the complication behavior they appreciate more is the display of relevant information that always feels up to date. A static complication that doesn’t display meaningful data may be less likely to remain in a prominent position on the watch face.

Support all complication families when possible. Supporting more families means that your complications are available on more watch faces. If you can’t display useful information for a particular complication family, provide an image that represents your app — like your app icon — that still lets people launch your app from the watch face.

Consider creating multiple complications for each family. Supporting multiple complications helps you take advantage of shareable watch faces and lets people configure a watch face that’s centered on an app they love. For example, an app that helps people train for triathlons could offer three circular complications — one for each segment of the race — each of which deep-links to the segment-specific area in the app. This app could also offer a shareable watch face that’s preconfigured to include its swimming, biking, and running complications and to use its custom images and colors. When people choose this watch face, they don’t have to do any configuration before they can start using it. For guidance, see .

Define a different deep link for each complication you support. It works well when each complication opens your app to the most relevant area. If all the complications you support open the same area in your app, they can seem less useful.

Keep privacy in mind. With the Always-On Retina display, information on the watch face might be visible to people other than the wearer. Make sure you help people prevent potentially sensitive information from being visible to others. For guidance, see .

Carefully consider when to update data. You provide a complication’s data in the form of a timeline where each entry has a value that specifies the time at which to display your data on the watch face. Different data sets might require different time values. For example, a meeting app might display information about an upcoming meeting an hour before the meeting starts, but a weather app might display forecast information at the time those conditions are expected to occur. You can update the timeline a limited number of times each day, and the system stores a limited number of timeline entries for each app, so you need to choose times that enhance the usefulness of your data. For developer guidance, see .


### Visual design

Choose a ring or gauge style based on the data you need to display. Many families support a ring or gauge layout that provides consistent ways to represent numerical values that can change over time. For example:

- The closed style can convey a value that’s a percentage of a whole, such as for a battery gauge.

- The open style works well when the minimum and maximum values are arbitrary — or don’t represent a percentage of the whole — like for a speed indicator.

- Similar to the open style, the segmented style also displays values within an app-defined range, and can convey rapid value changes, such as in the Noise complication.

Make sure images look good in tinted mode. In tinted mode, the system applies a solid color to a complication’s text, gauges, and images, and desaturates full-color images unless you provide tinted versions of them. For developer guidance, see . (If you’re using legacy templates, tinted mode applies only to graphic complications.) To help your complications perform well in tinted mode:

- Avoid using color as the only way to communicate important information. You want people to get the same information in tinted mode as they do in nontinted mode.

- When necessary, provide an alternative tinted-mode version of a full-color image. If your full-color image doesn’t look good when it’s desaturated, you can supply a different version of the image for the system to use in tinted mode.

Recognize that people might prefer to use tinted mode for complications, instead of viewing them in full color. When people choose tinted mode, the system automatically desaturates your complication, converting it to grayscale and tinting its images, gauges, and text using a single color that’s based on the wearer’s selected color.

When creating complication content, generally use line widths of two points or greater. Thinner lines can be difficult to see at a glance, especially when the wearer is in motion. Use line weights that suit the size and complexity of the image.

Provide a set of static placeholder images for each complication you support. The system uses placeholder images when there’s no other content to display for your complication’s data. For example, when people first install your app, the system can display a static placeholder while it checks to see if your app can generate a localized placeholder to use instead. Placeholder images can also appear in the carousel from which people select complications. Note that complication image sizes vary per layout (and per legacy template) and the size of a placeholder image may not match the size of the actual image you supply for that complication. For developer guidance, see .


### Circular

Circular layouts can include text, gauges, and full-color images in circular areas on the Infograph and Infograph Modular watch faces. The circular family also defines extra-large layouts for displaying content on the X-Large watch face.

You can also add text to accompany a regular-size circular image, using a design that curves the text along the bezel of some watch faces, like Infograph. The text can fill nearly 180 degrees of the bezel before truncating.

As you design images for a regular-size circular complication, use the following values for guidance.

> [NOTE] The system applies a circular mask to each image.

A SwiftUI view that implements a regular-size circular complication uses the following default text values:

- Style: Rounded

- Weight: Medium

- Text size: 12 pt (40mm), 12.5 pt (41mm), 13 pt (44mm), 14.5 pt (45mm/49mm)

If you want to design an oversized treatment of important information that can appear on the X-Large watch face — for example, the Contacts complication, which features a contact photo — use the extra-large versions of the circular family’s layouts. The following layouts let you display full-color images, text, and gauges in a large circular region that fills most of the X-Large watch face. Some of the text fields can support multicolor text.

Use the following values for guidance as you create images for an extra-large circular complication.

> [NOTE] The system applies a circular mask to the circular, open-gauge, and closed-gauge images.

Use the following values to create no-content placeholder images for your circular-family complications.

A SwiftUI view that implements an extra-large circular layout uses the following default text values:

- Style: Rounded

- Weight: Medium

- Text size: 34.5 pt (40mm), 36.5 pt (41mm), 36.5 pt (44mm), 41 pt (45mm/49mm)


### Corner

Corner layouts let you display full-color images, text, and gauges in the corners of the watch face, like Infograph. Some of the templates also support multicolor text.

As you design images for a corner complication, use the following values for guidance.

> [NOTE] The system applies a circular mask to each image.

Use the following values to create no-content placeholder images for your corner-family complications.

A SwiftUI view that implements a corner layout uses the following default text values:

- Style: Rounded

- Weight: Semibold

- Text size: 10 pt (40mm), 10.5 pt (41mm), 11 pt (44mm), 12 pt (45mm/49mm)


### Inline

Inline layouts include utilitarian small and large layouts.

Utilitarian small layouts are intended to occupy a rectangular area in the corner of a watch face, such as the Chronograph and Simple watch faces. The content can include an image, interface icon, or a circular graph.

As you design images for a utilitarian small layout, use the following values for guidance.

The utilitarian large layout is primarily text-based, but also supports an interface icon placed on the leading side of the text. This layout spans the bottom of a watch face, like the Utility or Motion watch faces.

As you design images for a utilitarian large layout, use the following values for guidance.


### Rectangular

Rectangular layouts can display full-color images, text, a gauge, and an optional title in a large rectangular region. Some of the text fields can support multicolor text.

The large rectangular region works well for showing details about a value or process that changes over time, because it provides room for information-rich charts, graphs, and diagrams. For example, the Heart Rate complication displays a graph of heart-rate values within a 24-hour period. The graph uses high-contrast white and red for the primary content and a lower-contrast gray for the graph lines and labels, making the data easy to understand at a glance.

Starting with watchOS 10, if you have created a rectangular layout for your watchOS app, the system may display it in the Smart Stack. You can optimize this presentation in a few ways:

- By supplying background color or content that communicates information or aids in recognition

- By using  to specify relevancy, and help ensure that your widget is displayed in the Smart Stack at times that are most appropriate and useful to people

- By creating a custom layout of your information that is optimized for the Smart Stack

For developer guidance, see . See  for additional guidance on designing widgets for the Smart Stack.

Use the following values for guidance as you create images for a rectangular layout.

> [NOTE] Both large-image layouts automatically include a four-point corner radius.

A SwiftUI view that implements a rectangular layout uses the following default text values:

- Style: Rounded

- Weight: Medium

- Text size: 16.5 pt (40mm), 17.5 pt (41mm), 18 pt (44mm), 19.5 pt (45mm/49mm)


### Legacy templates


#### Circular small

Circular small templates display a small image or a few characters of text. They appear in the corner of the watch face (for example, in the Color watch face).

As you design images for a circular small complication, use the following values for guidance.

> [NOTE] In each stack measurement, the width value represents the maximum size.


#### Modular small

Modular small templates display two stacked rows consisting of an icon and content, a circular graph, or a single larger item (for example, the bottom row of complications on the Modular watch face).

As you design icons and images for a modular small complication, use the following values for guidance.

> [NOTE] In each stack measurement, the width value represents the maximum size.


#### Modular large

Modular large templates offer a large canvas for displaying up to three rows of content (for example, in the center of the Modular watch face).

As you design icons and images for a modular large complication, use the following values for guidance.


#### Extra large

Extra large templates display larger text and images (for example, on the X-Large watch faces).

As you design icons and images for an extra large complication, use the following values for guidance.

> [NOTE] In each stack measurement, the width value represents the maximum size.


### Platform considerations

Not supported in iOS, iPadOS, macOS, tvOS, or visionOS.


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## Controls

`/design/human-interface-guidelines/controls`

_A control provides quick access to a feature of your app from Control Center, the Lock Screen, or the Action button._

A control is a button or toggle that provides quick access to your app’s features from other areas of the system. Control buttons perform an action, link to a specific area of your app, or launch a . Control toggles switch between two states, such as on and off.

People can add controls to Control Center by pressing and holding in an empty area of Control Center, to the Lock Screen by customizing their Lock Screen, and to the Action button by configuring the Action button in the Settings app.


### Anatomy

Controls contain a symbol image, a title, and, optionally, a value. The symbol visually represents what the control does and can be a symbol from  or a custom symbol. The title describes what the control relates to, and the value represents the state of the control. For example, the title can display the name of a light in a room, while the value can display whether it’s on or off.

Controls display their information differently depending on where they appear:

- In Control Center, a control displays its symbol and, at larger sizes, its title and value.

- On the Lock Screen, a control displays its symbol.

- On iPhone devices with a control assigned to the Action button, pressing and holding it displays the control’s symbol in the Dynamic Island, as well as its value (if present).


### Best practices

Offer controls for actions that provide the most benefit without having to launch your app. For example, launching a Live Activity from a control creates an easy and seamless experience that informs someone about progress without having to navigate to your app to stay up to date. For guidance, see .

Update controls when someone interacts with them, when an action completes, or remotely with a push notification. Update the contents of a control to accurately reflect the state and show if an action is still in progress.

Choose a descriptive symbol that suggests the behavior of the control. Depending on where a person adds a control, it may not display the title and value, so the symbol needs to convey enough information about the control’s action. For control toggles, provide a symbol for both the on and off states. For example, use the SF Symbols `door.garage.open` and `door.garage.closed` to represent a control that opens and closes a garage door. For guidance, see .

Use symbol animations to highlight state changes. For control toggles, animate the transition between both on and off states. For control buttons with actions that have a duration, animate indefinitely while the action performs and stop animating when the action is complete. For developer guidance, see  and .

Select a tint color that works with your app’s brand. The system applies this tint color to a control toggle’s symbol in its on state. When a person performs the action of a control from the Action button, the system also uses this tint color to display the value and symbol in the Dynamic Island. For guidance, see .

Help people provide additional information the system needs to perform an action. A person may need to configure a control to perform a desired action — for example, select a specific light in a house to turn on and off. If a control requires configuration, prompt people to complete this step when they first add it. People can reconfigure the control at any time. For developer guidance, see .

Provide hint text for the Action button. When a person presses the Action button, the system displays hint text to help them understand what happens when they press and hold. When someone presses and holds the Action button, the system performs the action configured to it. Use verbs to construct the hint text. For developer guidance, see .

If your control title or value can vary, include a placeholder. Placeholder information tells people what your control does when the title and value are situational. The system displays this information when someone brings up the controls gallery in Control Center or the Lock Screen and chooses your control, or before they assign it to the Action button.

Hide sensitive information when the device is locked. When the device is locked, consider having the system redact the title and value to hide personal or security-related information. Specify if the system needs to redact the symbol state as well. If specified, the system redacts the title and value, and displays the symbol in its off state.

Require authentication for actions that affect security. For example, require people to unlock their device to access controls to lock or unlock the door to their house or start their car. For developer guidance, see .


### Camera experiences on a locked device

If your app supports camera capture, starting with iOS 18 you can create a control that launches directly to your app’s camera experience while the device is locked. For any task beyond capture, a person must authenticate and unlock their device to complete the task in your app. For developer guidance, see .

Use the same camera UI in your app and your camera experience. Sharing UI leverages people’s familiarity with the app. By using the same UI, the transition to the app is seamless when someone captures content and taps a button to perform additional tasks, such as posting to a social network or editing a photo.

Provide instructions for adding the control. Help people understand how to add the control that launches this camera experience.


### Platform considerations

No additional considerations for iOS, iPadOS, or macOS. Not supported in watchOS, tvOS, or visionOS.


### Resources


##### Related


##### Developer documentation


### Change log

---

## Live Activities

`/design/human-interface-guidelines/live-activities`

_A Live Activity lets people track the progress of an activity, event, or task at a glance._

Live Activities let people keep track of tasks and events in glanceable locations across devices.  They go beyond push notifications, delivering frequent content and status updates over a few hours and letting people interact with the displayed information.

For example, a Live Activity might show the remaining time until a food delivery order arrives, live in-game information for a soccer match, or real-time fitness metrics and interactive controls to pause or cancel a workout.

Live Activities start on iPhone or iPad and automatically appear in system locations across a person’s devices:


### Anatomy

Live Activities appear across the system in various locations like the Dynamic Island and the Lock Screen. It serves as a unified home for alerts and indicators of ongoing activity. Depending on the device and system location where a Live Activity appears, the system chooses a presentation style or a combination of styles to compose the appearance of your Live Activity. As a result, your Live Activity must support:

In iOS and iPadOS, your Live Activity appears throughout the system using these presentations. Additionally, the system uses them to create default appearances for other contexts. For example, the compact presentation appears in the Dynamic Island on iPhone and consists of two elements that the system combines into a single view for Apple Watch and in CarPlay.


#### Compact

In the Dynamic Island, the system uses the compact presentation when only one Live Activity is active. The presentation consists of two separate elements: one on the leading side of the TrueDepth camera and one on the trailing side. Despite its limited space, the compact presentation displays up-to-date information about your app’s Live Activity.

For design guidance, see .


#### Minimal

When multiple Live Activities are active, the system uses the minimal presentation to display two of them in the Dynamic Island. One appears attached to the Dynamic Island while the other appears detached. Depending on its content size, the detached minimal presentation appears circular or oval. As with the compact presentation, people tap the minimal presentation to open its app or touch and hold it to see the expanded presentation.

For design guidance, see .


#### Expanded

When people touch and hold a Live Activity in compact or minimal presentation, the system displays the expanded presentation.

For design guidance, see .


#### Lock Screen

The system uses the Lock Screen presentation to display a banner at the bottom of the Lock Screen. In this presentation, use a layout similar to the expanded presentation.

When you alert people about Live Activity updates on devices that don’t support the Dynamic Island, the Lock Screen presentation briefly appears as a banner that overlays the Home Screen or other apps.

For design guidance, see .


#### StandBy

On iPhone in StandBy, your Live Activity appears in the minimal presentation. When someone taps it, it transitions to the Lock Screen presentation, scaled up by 2x to fill the screen. If your Lock Screen presentation uses a custom background color, the system automatically extends it to the whole screen to create a seamless, full-screen design.

For design guidance, see .


### Best practices

Offer Live Activities for tasks and events that have a defined beginning and end. Live Activities work best for tracking short to medium duration activities that don’t exceed eight hours.

Focus on important information that people need to see at a glance. Your Live Activity doesn’t need to display everything. Think about what information people find most useful and prioritize sharing it in a concise way. When a person wants to learn more, they can tap your Live Activity to open your app where you can provide additional detail.

Don’t use a Live Activity to display ads or promotions. Live Activities help people stay informed about ongoing events and tasks, so it’s important to display only information that’s related to those events and tasks.

Avoid displaying sensitive information. Live Activities are prominently visible and could be viewed by casual observers; for example, on the Lock Screen or in the Always-On display. For content people might consider sensitive or private, display an innocuous summary and let people tap the Live Activity to view the sensitive information in your app. Alternatively, redact views that may contain sensitive information and let people configure whether to show sensitive data. For developer guidance, see .

Create a Live Activity that matches your app’s visual aesthetic and personality in both dark and light appearances. This makes it easier for people to recognize your Live Activity and creates a visual connection to your app.

If you include a logo mark, display it without a container. This better integrates the logo mark with your Live Activity layout. Don’t use the entire app icon.

Don’t add elements to your app that draw attention to the Dynamic Island. Your Live Activity appears in the Dynamic Island while your app isn’t in use, and other items can appear in the Dynamic Island when your app is open.

Ensure text is easy to read. Use large, heavier-weight text — a medium weight or higher. Use small text sparingly and make sure key information is legible at a glance.


#### Creating Live Activity layouts

Adapt to different screen sizes and presentations. Live Activities scale to fit various device screens. Create layouts and assets for various devices and scale factors, recognizing that the actual size on screen may vary or change. Ensure they look great everywhere by using the values in  as guidance and providing appropriately sized content.

Adjust element size and placement for efficient use of space. Create a layout that only uses the space you need to clearly display its content. Adapt the size and placement of elements in your Live Activity so they fit well together.

Use familiar layouts for custom views and layouts. Templates with default system margins and recommended text sizes are available in . Using them helps your Live Activity remain legible at a glance and fit in with the visual language of its surroundings; for example, the Smart Stack on Apple Watch.

Use consistent margins and concentric placement. Use even, matching margins between rounded shapes and the edges of the Live Activity, including corners, to ensure a harmonious fit. This prevents elements from poking into the rounded shape of the Live Activity and creating visual tension. For example, when placing a rounded rectangle near a corner of your Live Activity, match its corner radius to the outer corner radius of the Live Activity by subtracting the margin and using a SwiftUI container to apply the correct corner radius. For developer guidance, see .

Keep content compact and snug within a margin that’s concentric to the outer edge of the Live Activity.

When separating a block of content, place it in an inset container shape or use a thick line. Don’t draw content all the way to the edge of the Dynamic Island.

> [TIP] To align nonrounded content in the rounded corners of the Live Activity view, it may be helpful to blur the nonrounded content in your drawing tool. When the content is blurred, it may be easier to find the positioning that best aligns with the outer perimeter of the view.

Dynamically change the height of your Live Activity on the Lock Screen or in the expanded presentation. When there’s less information to show, reduce the height of the Live Activity to only use the space needed for the content. When more information becomes available, increase the height to display additional content. For example, a rideshare app might display a more compact Live Activity without additional details while it locates a driver. The app’s height extends as more information is available to display the estimated pickup time, driver details, and so on.


#### Choosing colors

Carefully consider using a custom background color and opacity. You can’t customize background colors for compact, minimal, and expanded presentations. However, you can use a custom background color for the Lock Screen presentation. If you set a custom background color or image for the Lock Screen presentation, ensure sufficient contrast — especially for tint colors on devices that feature an Always-On display with reduced luminance.

Use color to express the character and identity of your app. Live Activities in the Dynamic Island use a black opaque background. Consider using bold colors for text and objects to convey the personality and brand of your app. Bold colors make your Live Activity recognizable at a glance, stand out from other Live Activities, and feel like a small, glanceable part of your app. Additionally, bold colors can help reinforce the relationship between elements in the Live Activity itself.

Tint your Live Activity’s key line color so that it matches your content. When the background is dark — for example, in Dark Mode — a key line appears around the Dynamic Island to distinguish it from other content. Choose a key line color that’s consistent with the color of other elements in your Live Activity. For developer guidance, see .


#### Adding transitions and animating content updates

In addition to extending and contracting transitions, Live Activities use system and custom animations with a maximum duration of two seconds. Note that the system doesn’t perform animations on Always-On displays with reduced luminance.

Use animations to reinforce the information you’re communicating and to bring attention to updates. In addition to moving the position of elements, you can animate elements in and out with the default content-replace transition, or create custom transitions using scale, opacity, and movement. For example, a sports app might use numeric content transitions for score changes or fade a timer in and out when it reaches zero.

Animate layout changes. Content updates can require a change to your Live Activity layout — for example, when it expands to fill the screen in StandBy or when more information becomes available. During the transition to a new layout, preserve as much of the existing layout as possible by animating existing elements to their new positions rather than removing and animating them back in.

Try to avoid overlapping elements. Sometimes, it’s best to animate out certain elements and then re-animate them in at a new position to avoid colliding with other parts of your transition. For example, when animating items in lists, only animate the element that moves to a new position and use fade-in-and-out transitions for the other list items.

For developer guidance, see .


#### Offering interactivity

Make sure tapping the Live Activity opens your app at the right location. Take people directly to related details and actions  — don’t make them navigate to find relevant information. For developer guidance on SwiftUI views that support deep linking to specific screens, see .

Focus on simple, direct actions. Buttons or toggles take up space that might otherwise display useful information. Only include interactive elements for essential functionality that’s directly related to your Live Activity and that people activate once or temporarily pause and resume, like music playback, workouts, or apps that access the microphone to record live audio. If you offer interactivity, prefer limiting it to a single element to help people avoid accidentally tapping the wrong control.

Consider letting people respond to event or progress updates. If an update to your Live Activity is something that a person could respond to, consider offering a button or toggle to let people take action. For example, the Live Activity of a rideshare app could include a button to contact the driver while waiting for a ride to arrive.


#### Starting, updating, and ending a Live Activity

Start Live Activities at appropriate times, and make it easy for people to turn them off in your app. People expect Live Activities to start and provide important updates for a task at hand or at specific times, even automatically. For example, they might expect a Live Activity to start after a food order, making a rideshare request, or when their favorite sports team’s match begins. However, Live Activities that appear unexpectedly can be surprising or even unwanted. Consider offering controls that allow people to turn off a Live Activity in the app view that corresponds to the activity. For example, a sports app may offer a button that lets people unfollow a game or team. When people can’t easily control the appearance of Live Activities from your app, they may choose to turn off Live Activities in Settings altogether.

Offer an App Shortcut that starts your Live Activity. App Shortcuts expose functionality to the system, allowing access in various contexts. For example, create an App Shortcut that allows people to start your Live Activity using the Action button on iPhone. For more information, see .

Update a Live Activity only when new content is available. If the underlying content or status remains the same, maintain the same display until the underlying content or status changes.

Alert people only for essential updates that require their attention. Live Activity alerts light up the screen and by default play the notification sound to alert people about updates they shouldn’t miss. Alerts also show the expanded presentation in the Dynamic Island or a banner on devices that don’t support the Dynamic Island. To ensure your Live Activities provide the most value, avoid alerting people too often or with updates that aren’t crucial, and don’t use push notifications alongside Live Activities for the same updates.

Let people track multiple events efficiently with a single Live Activity. Instead of creating separate Live Activities people need to jump between to track different events, prefer a single Live Activity that uses a dynamic layout and rotates through events. For example, a sports app could offer a single Live Activity that cycles through scored points, substitutions, and fouls across multiple matches.

Always end a Live Activity immediately when the task or event ends, and consider setting a custom dismissal time. When a Live Activity ends, the system immediately removes it from the Dynamic Island and in CarPlay. On the Lock Screen, in the Mac menu bar, and the watchOS Smart Stack, it remains for up to four hours. Depending on the Live Activity, showing a summary may only be relevant for a brief time after it ends. Consider choosing a custom dismissal time that’s proportional to the duration of your Live Activity. In most cases, 15 to 30 minutes is adequate. For example, a rideshare app could end its Live Activity when a ride completes and remain visible for 30 minutes to allow people to view the ride summary and leave a tip. For developer guidance, refer to .


### Presentation

Your Live Activity needs to support all locations, devices, and their corresponding appearances. Because it appears across systems at different dimensions, create Live Activity layouts that best support each place they appear.

Start with the iPhone design, then refine it for other contexts. Create standard designs for each presentation first. Then, depending on the functionality that your Live Activity provides, design additional custom layouts for specific contexts like iPhone in StandBy, CarPlay, or Apple Watch. For more information about custom layouts, refer to , , and .


#### Compact presentation

Focus on the most important information. Use the compact presentation to show dynamic, up-to-date information that’s essential to the Live Activity and easy to understand. For example, a sports app could display two team logos and the score.

Ensure unified information and design of the compact presentations in the Dynamic Island. Though the TrueDepth camera separates the leading and trailing elements, design them to read as a single piece of information, and use consistent color and typography to help create a connection between both elements.

Keep content as narrow as possible and ensure it’s snug against the TrueDepth camera. Try not to obscure key information in the status bar, and don’t add padding between content and the TrueDepth camera. Maintain a balanced layout with similarly sized views for both leading and trailing elements; for example, use shortened units or less precise data to maintain appropriate width and balance.

Link to relevant app content. When people tap a compact Live Activity, open your app directly to the related details. Ensure both leading and trailing elements link to the same screen.


#### Minimal presentation

Ensure that your Live Activity is recognizable in the minimal presentation. If possible, display updated information rather than just a logo, while ensuring people can quickly recognize your app. For example, the Timer app’s minimal Live Activity presentation displays the remaining time instead of a static icon.


#### Expanded presentation

Maintain the relative placement of elements to create a coherent layout between presentations. The expanded presentation is an enlarged version of the compact or minimal presentation. Ensure information and layouts expand predictably when the Live Activity expands.

Wrap content tightly around the TrueDepth camera. Arrange content close to the TrueDepth camera, and try to avoid leaving too much room around it to use space more efficiently and to help diminish the camera’s presence.


#### Lock Screen presentation

Don’t replicate notification layouts. Create a unique layout that’s specific to the information that appears in the Live Activity.

Choose colors that work well on a personalized Lock Screen. People customize their Lock Screen with wallpapers, custom tint colors, and widgets. To make a Live Activity fit a custom Lock Screen aesthetic while remaining legible, use custom background or tint colors and opacity sparingly.

Make sure your design, assets, and colors look great and offer enough contrast in Dark Mode and on an Always-On display. By default, a Live Activity on the Lock Screen uses a light background color in the light appearance and a dark background color in the dark appearance. If you use a custom background color, choose a color that works well in both modes or a different color for each appearance. Verify your choices on a device with an Always-On display with reduced luminance because the system adapts colors as needed in this appearance. For guidance, see  and ; for developer guidance, see .

Verify the generated color of the dismiss button. The system automatically generates a matching dismiss button based on the background and foreground colors of your Live Activity.  Verify that the generated color matches your design and adjust it if needed using .

Use standard margins to align your design with notifications. The standard layout margin for Live Activities on the Lock Screen is 14 points. While tighter margins may be appropriate for elements like graphics or buttons, avoid crowding the edges and creating a cluttered appearance. For developer guidance, see .


#### StandBy presentation

Update your layout for StandBy. Make sure assets look great at the larger scale, and consider creating a custom layout that makes use of the extra space. For developer guidance, see .

Consider using the default background color in StandBy. The default background color seamlessly blends your Live Activity with the device bezel, achieves a softer look that integrates with a person’s surroundings, and allows the system to scale the Live Activity slightly larger because it doesn’t need to account for the margins around the TrueDepth camera.

Use standard margins and avoid extending graphic elements to the edge of the screen. Without standard margins, content gets cut off as the Live Activity extends, making it feel broken.

Verify your design in Night Mode. In Night Mode, the system applies a red tint to your Live Activity. Check that your Live Activity design uses colors that provide enough contrast in Night Mode.


### CarPlay

In CarPlay, the system automatically combines the leading and trailing elements of the compact presentation into a single layout that appears on CarPlay Dashboard.

Your Live Activity design applies to both CarPlay and Apple Watch, so design for both contexts. While Live Activities on Apple Watch can be interactive, the system deactivates interactive elements in CarPlay. For more information, refer to  below. For developer guidance, refer to .

Consider creating a custom layout if your Live Activity would benefit from larger text or additional information. Instead of using the default appearance in CarPlay, declare support for a  supplemental activity family.

Carefully consider including buttons or toggles in your custom layout. In CarPlay, the system deactivates interactive elements in your Live Activity. If people are likely to start or observe your Live Activity while driving, prefer displaying timely content rather than buttons and toggles.


### Platform considerations

No additional considerations for iOS or iPadOS. Not supported in tvOS or visionOS.


#### macOS

Active Live Activities automatically appear in the Menu bar of a paired Mac using the compact, minimal, and expanded presentations. Clicking the Live Activity launches iPhone Mirroring to display your app.


#### watchOS

When a Live Activity begins on iPhone, it appears on a paired Apple Watch at the top of the Smart Stack. By default, the view displayed in the Smart Stack combines the leading and trailing elements from the Live Activity’s compact presentation on iPhone.

If you offer a watchOS app and someone taps the Live Activity in the Smart Stack, it opens your watchOS app. Without a watchOS app, tapping opens a full-screen view with a button to open your app on the paired iPhone.

Consider creating a custom watchOS layout. While the system provides a default view automatically, a custom layout designed for Apple Watch can show more information and add interactive functionality like a button or toggle.

Carefully consider including buttons or toggles in your custom layout. The custom watchOS layout also applies to your Live Activity in CarPlay where the system deactivates interactive elements. If people are likely to start or observe your Live Activity while driving, don’t include buttons or toggles in your custom watchOS layout. For developer guidance, see .

Focus on essential information and significant updates. Use space in the Smart Stack as efficiently as possible and think of the most useful information that a Live Activity can convey:

- Progress, like the estimated arrival time of a delivery

- Interactive elements, like stopwatch or timer controls

- Significant updates, like sports score changes


### Specifications

When you design your Live Activities, use the following values for guidance.


#### CarPlay dimensions

The system may scale your Live Activity to best fit a vehicle’s screen size and resolution. Use the listed values to verify your design:

Test your designs with the CarPlay simulator and the following configurations for Smart Display Zoom  — available in in Settings > Display in CarPlay:


#### iOS dimensions

All values listed in the tables below are in points.

The Dynamic Island uses a corner radius of 44 points, and its rounded corner shape matches the TrueDepth camera.


#### iPadOS dimensions

All values listed in the table below are in points.


#### macOS dimensions

Use the provided iOS dimensions.


#### watchOS dimensions

Live Activities in the Smart Stack use the same dimensions as watchOS widgets.


### Resources


##### Developer documentation

 — WidgetKit


##### Videos


### Change log

---

## Notifications

`/design/human-interface-guidelines/notifications`

_A notification gives people timely, high-value information they can understand at a glance._

Before you can send any notifications to people, you have to get their consent (for developer guidance, see ). After agreeing, people generally use settings to specify the styles of notification they want to receive, and to specify delivery times for notifications that have different levels of urgency. To learn more about the ways people can customize the notification experience, see .


### Anatomy

Depending on the platform, a notification can use various styles, such as:

- A banner or view on a Lock Screen, Home Screen, Home View, or desktop

- A badge on an app icon

- An item in Notification Center

In addition, a notification related to direct communication — like a phone call or message — can provide an interface that’s distinct from noncommunication notifications, featuring prominent contact images (or avatars) and group names instead of the app icon.


### Best practices

Provide concise, informative notifications. People turn on notifications to get quick updates, so you want to provide valuable information succinctly.

Avoid sending multiple notifications for the same thing, even if someone hasn’t responded. People attend to notifications at their convenience. If you send multiple notifications for the same thing, you fill up Notification Center, and people may turn off all notifications from your app.

Avoid sending a notification that tells people to perform specific tasks within your app. If it makes sense to offer simple tasks that people can perform without opening your app, you can provide . Otherwise, avoid telling people what to do because it’s hard for people to remember such instructions after they dismiss the notification.

Use an alert — not a notification — to display an error message. People are familiar with both alerts and notifications, so you don’t want to cause confusion by using the wrong component. For guidance, see .

Handle notifications gracefully when your app is in the foreground. Your app’s notifications don’t appear when your app is in the front, but your app still receives the information. In this scenario, present the information in a way that’s discoverable but not distracting or invasive, such as incrementing a badge or subtly inserting new data into the current view. For example, when a new message arrives in a mailbox that people are currently viewing, Mail simply adds it to the list of unread messages because sending a notification about it would be unnecessary and distracting.

Avoid including sensitive, personal, or confidential information in a notification. You can’t predict what people will be doing when they receive a notification, so it’s essential to avoid including private information that could be visible to others.


### Content

When a notification includes a title, the system displays it at the top where it’s most visible. In a notification related to direct communication, the system automatically displays the sender’s name in the title area; in a noncommunication notification, the system displays your app name if you don’t provide a title.

Create a short title if it provides context for the notification content. Prefer brief titles that people can read at a glance, especially on Apple Watch, where space is limited. When possible, take advantage of the prominent notification title area to provide useful information, like a headline, event name, or email subject. If you can only provide a generic title for a noncommunication notification — like New Document — it can be better to let the system display your app name instead. Use title-style  and no ending punctuation.

Write succinct, easy-to-read notification content. Use complete sentences, sentence case, and proper punctuation, and don’t truncate your message — the system does this automatically when necessary.

Provide generically descriptive text to display when notification previews aren’t available. In Settings, people can choose to hide notification previews for all apps. In this situation, the system shows only your app icon and the default title Notification. To give people sufficient context to know whether they want to view the full notification, write body text that succinctly describes the notification content without revealing too many details, like “Friend request,” “New comment,” “Reminder,” or “Shipment” (for developer guidance, see ). Use sentence-style  for this text.

Avoid including your app name or icon. The system automatically displays a large version of your app icon at the leading edge of each notification; in a communication notification, the system displays the sender’s contact image badged with a small version of your icon.

Consider providing a sound to supplement your notifications. Sound can be a great way to distinguish your app’s notifications and get someone’s attention when they’re not looking at the device. You can create a custom sound that coordinates with the style of your app or use a system-provided alert sound. If you use a custom sound, make sure it’s short, distinctive, and professionally produced. A notification sound can enhance the user experience, but don’t rely on it to communicate important information, because people may not hear it. Although people might also want a vibration to accompany alert sounds, you can’t provide such a vibration programmatically. For developer guidance, see .


### Notification actions

A notification can present a customizable detail view that contains up to four buttons people use to perform actions without opening your app. For example, a Calendar event notification provides a Snooze button that postpones the event’s alarm for a few minutes. For developer guidance, see .

Provide beneficial actions that make sense in the context of your notification. Prefer actions that let people perform common, time-saving tasks that eliminate the need to open your app. For each button, use a short, title-case term or phrase that clearly describes the result of the action. Don’t include your app name or any extraneous information in the button label, keep the text brief to avoid truncation, and take localization into account as you write it.

Avoid providing an action that merely opens your app. When people tap a notification or its preview, they expect your app to display related content, so presenting an action button that does the same thing clutters the detail view and can be confusing.

Prefer nondestructive actions. If you must provide a destructive action, make sure people have enough context to avoid unintended consequences. The system gives a distinct appearance to the actions you identify as destructive.

Provide a simple, recognizable interface icon for each notification action. An interface icon reinforces an action’s meaning, helping people instantly understand what it does. The system displays your interface icon on the trailing side of the action title. When you use , you can choose an existing symbol that represents your command or edit a related symbol to create a custom icon.


### Badging

A badge is a small, filled oval containing a number that can appear on an app icon to indicate the number of unread notifications that are available. After people address unread notifications, the badge disappears from the app icon, reappearing when new notifications arrive. People can choose whether to allow an app to display badges in their notification settings.

Use a badge only to show people how many unread notifications they have. Don’t use a badge to convey numeric information that isn’t related to notifications, such as weather-related data, dates and times, stock prices, or game scores.

Make sure badging isn’t the only method you use to communicate essential information. People can turn off badging for your app, so if you rely on it to show people when there’s important information, people can miss the message. Always make sure that you make important information easy for people to find as soon as they open your app.

Keep badges up to date. Update your app’s badge as soon as people open the corresponding notifications. You don’t want people to think there are new notifications available, only to find that they’ve already viewed them all. Note that reducing a badge’s count to zero removes all related notifications from Notification Center.

Avoid creating a custom image or component that mimics the appearance or behavior of a badge. People can turn off notification badges if they choose, and will become frustrated if they have done so and then see what appears to be a badge.


### Platform considerations

No additional considerations for iOS, iPadOS, macOS, tvOS, or visionOS.


#### watchOS

On Apple Watch, notifications occur in two stages: short look and long look. People can also view notifications in Notification Center. On supported devices, people can double-tap to respond to notifications.

You can help people have a great notification experience by designing app-specific assets and actions that are relevant on Apple Watch. If your watchOS app has an iPhone companion that supports notifications, watchOS can automatically provide default short-look and long-look interfaces if necessary.


##### Short looks

A short look appears when the wearer’s wrist is raised and disappears when it’s lowered.

Avoid using a short look as the only way to communicate important information. A short look appears only briefly, giving people just enough time to see what the notification is about and which app sent it. If your notification information is critical, make sure you deliver it in other ways, too.

Keep privacy in mind. Short looks are intended to be discreet, so it’s important to provide only basic information. Avoid including potentially sensitive information in the notification’s title.


##### Long looks

Long looks provide more detail about a notification. If necessary, people can swipe vertically or use the Digital Crown to scroll a long look. After viewing a long look, people can dismiss it by tapping it or simply by lowering their wrist.

A custom long-look interface can be static or dynamic. The static interface lets you display a notification’s message along with additional static text and images. The dynamic interface gives you access to the notification’s full content and offers more options for configuring the appearance of the interface.

You can customize the content area for both static and dynamic long looks, but you can’t change the overall structure of the interface. The system-defined structure includes a sash at the top of the interface and a Dismiss button at the bottom, below all custom buttons.

Consider using a rich, custom long-look notification to let people get the information they need without launching your app. You can use SwiftUI  to create engaging, interruptible animations; alternatively, you can use  or .

At the minimum, provide a static interface; prefer providing a dynamic interface too. The system defaults to the static interface when the dynamic interface is unavailable, such as when there is no network or the iPhone companion app is unreachable. Be sure to create the resources for your static interface in advance and package them with your app.

Choose a background appearance for the sash. The system-provided sash, at the top of the long-look interface, displays your app icon and name. You can customize the sash’s color or give it a blurred appearance. If you display a photo at the top of the content area, you’ll probably want to use the blurred sash, which has a light, translucent appearance that gives the illusion of overlapping the image.

Choose a background color for the content area. By default, the long look’s background is transparent. If you want to match the background color of other system notifications, use white with 18% opacity; otherwise, you can use a custom color, such as a color within your brand’s palette.

Provide up to four custom actions below the content area. For each long look, the system uses the notification’s type to determine which of your custom actions to display as buttons in the notification UI. In addition, the system always displays a Dismiss button at the bottom of the long-look interface, below all custom buttons. If your watchOS app has an iPhone companion that supports notifications, the system shares the actionable notification types already registered by your iPhone app and uses them to configure your custom action buttons.


##### Double tap

People can double-tap to respond to notifications on supported devices. When a person responds to a notification with a double tap, the system selects the first nondestructive action as the response.

Keep double tap in mind when choosing the order of custom actions you present as responses to a notification. Because a double tap runs the first nondestructive action, consider placing the action that people use most frequently at the top of the list. For example, a parking app that provides custom actions for extending the time on a paid parking spot could offer options to extend the time by 5 minutes, 15 minutes, or an hour, with the most common choice listed first.


### Resources


##### Related


##### Developer documentation

 — User Notifications


##### Videos


### Change log

---

## Snippets

`/design/human-interface-guidelines/snippets`

_When someone performs a task with Siri or an App Shortcut, a snippet shows the result or asks for confirmation._

Snippets are compact views that appear in response to an action that someone takes using , Spotlight, or the Shortcuts app.

You can present a snippet related to one of your app’s actions by including it with an  that you design to meet the specific needs of a task. For example, you might design a snippet for checking the weather forecast or updating progress toward a daily goal.

There are two snippet types: confirmation and result. A confirmation snippet lets people confirm or cancel an action, and may include options that affect the result. By contrast, a result snippet provides information — possibly as the outcome of a confirmation — that doesn’t require further action. An app intent that displays a snippet always shows a result, while the confirmation step is optional.

For developer guidance, see .


### Anatomy

A snippet consists of the following elements:

- Dialogue. The app intent dialogue that Siri speaks to communicate the snippet’s information. The system includes the dialogue text by default and places it above the custom view.

- Custom view. A view that visually communicates the snippet’s information. A custom view can include one or more buttons for modifying the content of the snippet, getting more information, or taking another action.

- System-provided button(s). A confirmation snippet includes two system-provided buttons under the custom view: a secondary Cancel button and a primary button with a customizable label. A result snippet includes a single Done button that dismisses the view.


### Best practices

Ensure legibility. Check for sufficient contrast between the snippet’s custom content and the system-provided background in both light and dark appearances, and keep consistent margins for the content within the view. This clarifies the layout and helps people interpret the snippet quickly and reliably.

Keep content concise. Snippets exist to facilitate lightweight, quick interactions, so it’s important to keep their content short and easily legible. To ensure all content is visible, create custom views that are no taller than the 400-point maximum height. When considering the amount of text to include, be mindful that fonts draw at various sizes based on a person’s preferred text size setting. For a result snippet, if you need to provide more detail, deep-link to the content in your app instead of including it in the custom view.

Choose a descriptive label for a confirmation snippet’s primary button. You can choose an appropriate label from among those that the , or you can supply a custom label. For example, when designing a snippet to order coffee, labeling the primary button Order is clearer than labeling it OK or Proceed. If you don’t specify a label, the system default is Continue.

Communicate a snippet’s purpose visually. Don’t rely on showing the dialogue text to convey a snippet’s purpose. While the spoken app intent dialogue is essential for interactions when someone isn’t looking at the screen, prefer to omit it from a snippet’s visual representation and use the custom view to convey its information instead.


### Platform considerations

No additional considerations for iOS, iPadOS, or macOS. Not supported in tvOS, visionOS, or watchOS.


### Resources


##### Related


##### Developer documentation


##### Videos


### Change log

---

## Status bars

`/design/human-interface-guidelines/status-bars`

_A status bar appears along the upper edge of the screen and displays information about the device’s current state, like the time, cellular carrier, and battery level._


### Best practices

Obscure content under the status bar. By default, the background of the status bar is transparent, allowing content beneath to show through. This transparency can make it difficult to see information presented in the status bar. If controls are visible behind the status bar, people may attempt to interact with them and be unable to do so. Be sure to keep the status bar readable, and don’t imply that content behind it is interactive. Prefer using a scroll edge effect to place a blurred view behind the status bar. For developer guidance, see  and .

Consider temporarily hiding the status bar when displaying full-screen media. A status bar can be distracting when people are paying attention to media. Temporarily hide these elements to provide a more immersive experience. The Photos app, for example, hides the status bar and other interface elements when people browse full-screen photos.

Avoid permanently hiding the status bar. Without a status bar, people have to leave your app to check the time or see if they have a Wi-Fi connection. Let people redisplay a hidden status bar with a simple, discoverable gesture. For example, when browsing full-screen photos in the Photos app, a single tap shows the status bar again.


### Platform considerations

No additional considerations for iOS or iPadOS. Not supported in macOS, tvOS, visionOS, or watchOS.


### Resources


##### Developer documentation

 — UIKit

 — UIKit

---

## Top Shelf

`/design/human-interface-guidelines/top-shelf`

_The Apple TV Home Screen provides an area called Top Shelf, which showcases your content in a rich, engaging way while also giving people access to their favorite apps in the Dock._

When you support full-screen Top Shelf, people can swipe through multiple full-screen content views, play trailers and previews, and get more information about your content.

Top Shelf is a unique opportunity to highlight new, featured, or recommended content and let people jump directly to your app or game to view it. For example, when people select Apple TV in the Dock, full-screen previews immediately begin playing and soon the Dock slides away. As people watch previews for the first show, they can swipe through previews of all other featured shows, stopping to select Play or More Info for a preview that interests them.

The system defines several layout templates that you can use to give people a compelling Top Shelf experience when they select your app in the Dock. To help you position content, you can download these templates from .


### Best practices

Help people jump right into your content. Top Shelf provides a path to the content people care about most. Two of the system-provided layout templates —  and  — each include two buttons by default: A primary button intended to begin playback and a More Info button intended to open your app to a view that displays details about the content.

Feature new content. For example, showcase new releases or episodes, highlight upcoming movies and shows, and avoid promoting content that people have already purchased, rented, or watched.

Personalize people’s favorite content. People typically put the apps they use most often into Top Shelf. You can personalize their experience by showing targeted recommendations in the Top Shelf content you supply, letting people resume media playback or jump back into active gameplay.

Avoid showing advertisements or prices. People put your app into Top Shelf because you’ve already sold them on it, so they may not appreciate seeing lots of ads from your app. Showing purchasable content in the Top Shelf is fine, but prefer putting the focus on new and exciting content, and consider displaying prices only when people show interest.

Showcase compelling dynamic content that can help draw people in and encourage them to view more. If necessary, you can supply static images, but people typically prefer a captivating, dynamic Top Shelf experience that features the newest or highest rated content. To provide this experience, prefer creating  to display in Top Shelf.

If you don’t provide the recommended full-screen content, supply at least one static image as a fallback. The system displays a static image when your app is in the Dock and in focus and full-screen content is unavailable. tvOS flips and blurs the image, ensuring that it fits into a width of 1920 pixels at the 16:9 aspect ratio. Use the following values for guidance.

Avoid implying interactivity in a static image. A static Top Shelf image isn’t focusable, and you don’t want to make people think it’s interactive.


### Dynamic layouts

Dynamic Top Shelf images can appear in several ways:

- A carousel of full-screen video and images that includes two buttons and optional details

- A row of focusable content

- A set of scrolling banners


#### Carousel actions

The carousel actions layout style focuses on full-screen video and images and includes a few unobtrusive controls that help people see more. This layout style works especially well to showcase content that people already know something about. For example, it’s great for displaying user-generated content, like photos, or new content from a franchise or show that people are likely to enjoy.

Provide a title. Include a succinct title, like the title of the show or movie or the title of a photo album. If necessary, you can also provide a brief subtitle. For example, a subtitle for a photo album could be a range of dates; a subtitle for an episode could be the name of the show.


#### Carousel details

This layout style extends the carousel actions layout style, giving you the opportunity to include some information about the content. For example, you might provide information like a plot summary, cast list, and other metadata that helps people decide whether to choose the content.

Provide a title that identifies the currently playing content. The content title appears near the top of the screen so it’s easy for people to read it at a glance. Above the title, you can also provide a succinct phrase or app attribution, like “Featured on My App.”


#### Sectioned content row

This layout style shows a single labeled row of sectioned content, which can work well to highlight recently viewed content, new content, or favorites. Row content is focusable, which lets people scroll quickly through it. A label appears when an individual piece of content comes into focus, and small movements on the remote’s Touch surface bring the focused image to life. You can also configure a sectioned content row to show multiple labels.

Provide enough content to constitute a complete row. At a minimum, load enough images in a sectioned content row to span the full width of the screen. In addition, include at least one label for greater platform consistency and to provide additional context.

You can use the following image sizes in a sectioned content row.


##### Poster (2:3)


##### Square (1:1)


##### 16:9

Be aware of additional scaling when combining image sizes. If your Top Shelf design includes a mixture of image sizes, keep in mind that images will automatically scale up to match the height of the tallest image if necessary. For example, a 16:9 image scales to 500 pixels high if included in a row with a poster or square image.


##### Scrolling inset banner

This layout shows a series of large images, each of which spans almost the entire width of the screen. Apple TV automatically scrolls through these banners on a preset timer until people bring one into focus. The sequence circles back to the beginning after the final image is reached.

When a banner is in focus, a small, circular gesture on the remote’s Touch surface enacts the system focus effect, animating the item, applying lighting effects, and, if the banner contains layered images, producing a 3D effect. Swiping on the Touch surface pans to the next or previous banner in the sequence. Use this style to showcase rich, captivating content, such as a popular new movie.

Provide three to eight images. A minimum of three images is recommended for a scrolling banner to feel effective. More than eight images can make it hard to navigate to a specific image.

If you need text, add it to your image. This layout style doesn’t show labels under content, so all text must be part of the image itself. In layered images, consider elevating text by placing it on a dedicated layer above the others. Add the text to the accessibility label of the image too, so  can read it.

Use the following size for a scrolling inset banner image:


### Platform considerations

Not supported in iOS, iPadOS, macOS, visionOS, or watchOS.


### Resources


##### Related


##### Videos

---

## Watch faces

`/design/human-interface-guidelines/watch-faces`

_A watch face is a view that people choose as their primary view in watchOS._

The watch face is at the heart of the watchOS experience. People choose a watch face they want to see every time they raise their wrist, and they customize it with their favorite complications. People can even customize different watch faces for different activities, so they can switch to the watch face that fits their current context.

In watchOS 7 and later, people can share the watch faces they configure. For example, a fitness instructor might configure a watch face to share with their students by choosing the Gradient watch face, customizing the color, and adding their favorite health and fitness complications. When the students add the shared watch face to their Apple Watch or the Watch app on their iPhone, they get a custom experience without having to configure it themselves.

You can also configure a watch face to share from within your app, on your website, or through Messages, Mail, or social media. Offering shareable watch faces can help you introduce more people to your complications and your app.


### Best practices

Help people discover your app by sharing watch faces that feature your complications. Ideally, you support multiple complications so that you can showcase them in a shareable watch face and provide a curated experience. For some watch faces, you can also specify a system accent color, images, or styles. If people add your watch face but haven’t installed your app, the system prompts them to install it.

Display a preview of each watch face you share. Displaying a preview that highlights the advantages of your watch face can help people visualize its benefits. You can get a preview by using the iOS Watch app to email the watch face to yourself. The preview includes an illustrated device bezel that frames the face and is suitable for display on websites and in watchOS and iOS apps. Alternatively, you can replace the illustrated bezel with a high-fidelity hardware bezel that you can download from  and composite onto the preview. For developer guidance, see .

Aim to offer shareable watch faces for all Apple Watch devices. Some watch faces are available on Series 4 and later — such as California, Chronograph Pro, Gradient, Infograph, Infograph Modular, Meridian, Modular Compact, and Solar Dial — and Explorer is available on Series 3 (with cellular) and later. If you use one of these faces in your configuration, consider offering a similar configuration using a face that’s available on Series 3 and earlier. To help people make a choice, you can clearly label each shareable watch face with the devices it supports.

Respond gracefully if people choose an incompatible watch face. The system sends your app an error when people try to use an incompatible watch face on Series 3 or earlier. In this scenario, consider immediately offering an alternative configuration that uses a compatible face instead of displaying an error. Along with the previews you provide, help people understand that they might receive an alternative watch face if they choose a face that isn’t compatible with their Apple Watch.


### Platform considerations

Not supported in iOS, iPadOS, macOS, tvOS, or visionOS.


### Resources


##### Related


##### Developer documentation

 — ClockKit

---

## Widgets

`/design/human-interface-guidelines/widgets`

_A widget provides quick access to essential information and focused interactions from your app or game in additional contexts._

Widgets help people organize and personalize their devices by displaying timely, glanceable content and offering specific functionality. They appear in various contexts for a consistent experience across platforms. For example, a person might place a Weather widget:

- On the Home Screen and Lock Screen of their iPhone and iPad

- On the desktop and Notification Center of their Mac

- On a horizontal or vertical surface when they wear Apple Vision Pro

- At a fixed position in the Smart Stack of Apple Watch


### Anatomy

Widgets come in different sizes, ranging from small accessory widgets on iPhone, iPad, and Apple Watch to system family widgets that include an extra large size on iPad, Mac, and Apple Vision Pro. Additionally, widgets adapt their appearance to the context in which they appear and respond to a person’s device customization. Consider the following aspects when you design widgets:

- The widget size to support

- The context — devices and system experiences — in which the widget may appear

- The rendering modes and color treatment that the widget receives based on the size and context

The WidgetKit framework provides default appearances and treatments for each widget size to fit the system experience or device where it appears. However, it’s important to consider creating a custom widget design that can provide the best experience for your content in each specific context.


#### System family widgets

System family widgets offer a broad range of sizes and may include one or more interactive elements.

The following table shows supported contexts for each system family widget size:


#### Accessory widgets

Accessory widgets display a very limited amount of information because of their size.

They appear on the following devices:


#### Appearances

A widget can appear in full-color, in monochrome with a tint color, or in a clear, translucent style. Depending on the location, device, and a person’s customization, the system may apply a tinted or clear appearance to the widget and its included full-color images, symbols, and glyphs.

For example, a small system widget appears differently depending on the device and location:

- On the Home Screen of iPhone and iPad, people choose from different appearances for widgets: light, dark, clear, and tinted. In light and dark appearances, widgets have a full-color design. In a clear appearance, the system desaturates the widget and adds translucency, highlights, and the Liquid Glass material. In a tinted appearance, the system desaturates the widget and its content, then applies a person’s selected tint color.

- On Apple Vision Pro, the widget appears as a 3D object, surrounded by a frame. It takes on a full-color appearance with a glass- or paper-like coating layer that responds to lighting conditions. Additionally, people can choose a tinted appearance that applies a color from a set of system-provided color palettes.

- On the Lock Screen of iPad, the widget takes on a monochromatic appearance without a tint color.

- On the Lock Screen of iPhone in StandBy, the widget appears scaled up in size with the background removed. When the ambient light falls below a threshold, the system renders the widget with a monochromatic red tint.

Similarly, a rectangular accessory widget appears as follows:

- On the Lock Screen of iPhone and iPad, it takes on a monochromatic appearance without a tint color.

- On Apple Watch, the widget can appear as a watch complication in both full-color and tinted appearances, and it can also appear in the Smart Stack.

Each appearance described above includes a  that depends on the platform and a person’s appearance settings:

- The system uses the  rendering mode for system family widgets across all platforms to display your widget in full color. It doesn’t change the color of your views.

- The system uses the  rendering mode for system family widgets across all platforms and for accessory widgets on Apple Watch. In the accented rendering mode, the system removes the background and replaces it with a tinted color effect for a tinted appearance and a Liquid Glass background for a clear appearance. Additionally, it divides the widget’s views into an accent group and a primary group, and then applies a solid color to each group.

- The system uses the  rendering mode for widgets on the Lock Screen of iPhone and iPad, and on iPhone in StandBy in low-light conditions. It desaturates text, images, and gauges, and creates a vibrant effect by coloring your content appropriately for the Lock Screen background or a macOS desktop. Note that people can customize the Lock Screen with a tint color, and the system applies a red tint for widgets that appear on iPhone in StandBy in low-light conditions.

The following table lists the occurrences for each rendering mode per platform:

For additional design guidance, see . For developer guidance, see  and .


### Best practices

Choose simple ideas that relate to your app’s main purpose. Include timely content and relevant functionality. For example, people who use the Weather app are often most interested in the current high and low temperatures and weather conditions, so the Weather widgets prioritize this information.

Aim to create a widget that gives people quick access to the content they want. People appreciate widgets that display meaningful content and offer useful actions and deep links to key areas of your app. Replicating an app icon offers little additional value, and people may be less likely to keep it on their screens.

Prefer dynamic information that changes throughout the day. If a widget’s content never appears to change, people may not keep it in a prominent position. Although widgets don’t update from minute to minute, it’s important to find ways to keep their content fresh to invite frequent viewing.

Look for opportunities to surprise and delight. For example, you might design a unique visual treatment for your calendar widget to display on meaningful occasions, like birthdays or holidays.

Offer widgets in multiple sizes when doing so adds value. Small widgets use their limited space to typically show a single piece of information while larger sizes support additional layers of information and actions. Avoid expanding a smaller widget’s content to simply fill a larger area. It’s more important to create one widget in the size that best represents the content than providing the widget in all sizes.

Balance information density. Sparse layouts can make the widget seem unnecessary, while overly dense layouts are less glanceable. Create a layout that provides essential information at a glance and allows people to view additional details by taking a longer look. If your layout is too dense, consider improving its clarity by using a larger widget size or replacing text with graphics.

Display only the information that’s directly related to the widget’s main purpose. In larger widgets, you can display more data — or more detailed visualizations of the data — but you don’t want to lose sight of the widget’s primary purpose. For example, all Calendar widgets display a person’s upcoming events. In each size, the widget remains centered on events while expanding the range of information as the size increases.

Use brand elements thoughtfully. Incorporate brand colors, typefaces, and stylized glyphs to make your widget recognizable but don’t overpower useful information or make your widget look out of place. When you include brand elements, people seldom need your logo or app icon to help them recognize your widget. If your widget benefits from including a small logo — for example, if your widget displays content from multiple sources — a small logo in the top-right corner is sufficient.

Choose between automatically displaying content and letting people customize displayed information. In some cases, people need to configure a widget to ensure it displays the information that’s most useful for them. For example, the Stocks widget lets people select the stocks they wish to track. In contrast, some widgets — like the Podcasts widget — automatically display recent content, so people don’t need to customize them. For developer guidance, see .

Avoid mirroring your widget’s appearance within your app. Including an element in your app that looks like your widget but doesn’t behave like it can confuse people. Additionally, people may be less likely to try other ways to interact with such an element in your app because they expect it to behave like a widget.

Let people know when authentication adds value. If your widget provides additional functionality when someone is signed in to your app, make sure people know that. For example, an app that shows upcoming reservations might include a message like “Sign in to view reservations” when people are signed out.


#### Updating widget content

To remain relevant and useful, widgets periodically refresh their information but don’t support continuous, real-time updates, and the system may adjust the limits for updates depending on various factors.

Keep your widget up to date. Finding the appropriate update frequency for your widget depends on knowing how often the data changes and estimating when people need to see new data. For example, a widget that provides information about tidal conditions at a beach is useful if it updates on an hourly basis even though conditions change constantly. If people are likely to check your widget more frequently than you can update it, consider displaying text that describes when the data was last updated.

Use system functionality to refresh dates and times in your widget. Because widget update frequency is limited, let the system automatically refresh date and time information to preserve update opportunities. Determine the update frequency that fits with the data you display and show content quickly without hiding stale data behind placeholder content. For developer guidance about widget updates, see .

Use animated transitions to bring attention to data updates. By default, many SwiftUI views animate content updates. Additionally, use standard and custom animations with a duration of up to two seconds to let people know when new information is available or when content displays differently. For developer guidance, see .


#### Adding interactivity

People tap or click a widget to launch its corresponding app. It can also include buttons and toggles to offer additional functionality without launching the app. For example, the Reminders widget includes toggles to mark a task as completed.  When people interact with your widget in areas that aren’t buttons or toggles, the interaction launches your app.

Offer simple, relevant functionality and reserve complexity for your app. Useful widgets offer an easy way to complete a task or action that’s directly related to its content.

Ensure that a widget interaction opens your app at the right location. Deep link to details and actions that directly relate to the widget’s content, and don’t make people navigate to the relevant area in the app. For example, when people click or tap a medium Stocks widget, the Stocks app opens to a page that displays information about the symbol.

Offer interactivity while remaining glanceable and uncluttered. Multiple interaction targets — SwiftUI links, buttons, and toggles — might make sense for your content, but avoid creating app-like layouts in your widgets. Pay attention to the size of targets and make sure people can tap or click them with confidence and without accidentally performing unintended interactions. Note that inline accessory widgets offer only one tap target.


#### Choosing margins and padding

Widgets scale to adapt to the screen sizes of different devices and onscreen areas. Supply content at appropriate sizes to make sure that your widget looks great on every device and let the system resize or scale it as necessary. In iOS, the system ensures that your widget looks good on small devices by resizing the content you design for large devices. In iPadOS, the system renders your widget at a large size before scaling it down for display on the Home Screen.

As you design for various devices and scale factors, use the values listed in  and the  for guidance; for your production widget, use  to ensure flexibility.

In general, use standard margins to ensure legibility. Use the standard margin width for widgets — 16 points for most widgets — to avoid crowding their edges and creating a cluttered appearance. If you need to use tighter margins — for example, to create content groupings for graphics, buttons, or background shapes — setting margins of 11 points can work well. Additionally, note that widgets use smaller margins on the desktop on Mac and on the Lock Screen, including in StandBy. For developer guidance, see .

Coordinate the corner radius of your content with the corner radius of the widget. To ensure that your content looks good within a widget’s rounded corners, use a SwiftUI container to apply the correct corner radius. For developer guidance, see .


#### Displaying text in widgets

Prefer using the system font, text styles, and SF Symbols. Using the system font helps your widget look at home on any platform, while making it easier for you to display great-looking text in a variety of weights, styles, and sizes. Use SF Symbols to align and scale symbols with text that uses the system font. If you use a custom font, do so sparingly, and be sure it’s easy for people to read at a glance. It often works well to use a custom font for the large text in a widget and SF Pro for the smaller text. For guidance, see  and .

Avoid very small font sizes. In general, display text using fonts at 11 points or larger. Text in a font that’s smaller than 11 points can be too hard for many people to read.

Avoid rasterizing text. Always use text elements and styles to ensure that your text scales well and to allow VoiceOver to speak your content.

> [NOTE] In iOS, iPadOS, and visionOS, widgets support Dynamic Type sizes from Large to AX5 when you use  to choose a system font or  to choose a custom font. For more information about Dynamic Type sizes, see .


#### Using color

Use color to enhance a widget’s appearance without competing with its content. Beautiful colors draw the eye, but they’re best when they don’t prevent people from absorbing a widget’s information at a glance. In your asset catalog, you can also specify the colors you want the system to use as it generates your widget’s editing-mode user interface.

Convey meaning without relying on specific colors to represent information. Widgets can appear monochromatic (with or without a custom tint color), and in watchOS, the system may invert colors depending on the watch face a person chooses. Use text and iconography in addition to color to express meaning.

Use full-color images judiciously. When a person chooses a tinted or clear appearance for their widgets, the system by default desaturates full-color images. You can choose to render images in full-color, even when a person chooses a tinted or clear widget appearance. However, full-color images in these appearances draw special attention to the widget, which might make it feel as if the widget doesn’t belong to the platform. For example, a full-color image in a widget might appear out of place when a person chooses a clear widget appearance. Consider reserving full-color images to represent media content, such as album art for a music app’s widget, and use full-color images with smaller dimensions than the size of the widget.


### Rendering modes


#### Full-color

Support light and dark appearances. Prefer light backgrounds for the light appearance and dark backgrounds for the dark appearance, and consider using the semantic system colors for text and backgrounds to let the colors dynamically adapt to the current appearance. You can also support different appearances by putting color variants in your asset catalog. For guidance, see ; for developer guidance, see  and .


#### Accented

Group widget components into an accented and a primary group.  The accented rendering mode divides the widget’s view hierarchy into an accent group and a primary group. On iPhone, iPad, and Mac, the system tints primary and accented content white. On Apple Watch, the system tints primary content white and accented content in the color of the watch face.

For developer guidance, see  and .


#### Vibrant

Offer enough contrast to ensure legibility. In the vibrant rendering mode, the opacity of pixels within an image determines the strength of the blurred background material effect. Fully transparent pixels let the background material pass through as is. The brightness of pixels determines how vibrant they appear on the Lock Screen. Brighter gray values provide more contrast, and darker values provide less contrast.

Create optimized assets for the best vibrant effect. Render content like images, numbers, and text at full opacity. Use white or light gray for the most prominent content and darker grayscale values for secondary elements to establish hierarchy. Confirm that image content has sufficient contrast in grayscale, and use opaque grayscale values, rather than opacities of white, to achieve the best vibrant material effect.


### Previews and placeholders

Design a realistic preview to display in the widget gallery. Highlighting your widget’s capabilities — and clearly representing the experiences each widget type or size can provide — helps people make an informed decision. You can display real data in your widget preview, but if the data takes too long to generate or load, display realistic simulated data instead.

Design placeholder content that helps people recognize your widget. An installed widget displays placeholder content while its data loads. Create an effective placeholder appearance by combining static interface components with semi-opaque shapes that stand in for dynamic content. For example, use rectangles of different widths to suggest lines of text, and circles or squares in place of glyphs and images.

Write a succinct widget description. The widget gallery displays descriptions that help people understand what each widget does. Begin a description with an action verb — for example, “See the current weather conditions and forecast for a location” or “Keep track of your upcoming events and meetings.” Avoid including unnecessary phrases that reference the widget itself, like “This widget shows…,” “Use this widget to…,” or “Add this widget.” Use approachable language and .

Group your widget’s sizes together, and provide a single description. If your widget is available in multiple sizes, group them together so people don’t think each size is a different widget. Provide a single description of your widget — regardless of how many sizes you offer — to avoid repetition and to help people understand how each size provides a slightly different perspective on the same content and functionality.

Consider coloring the Add button. After people choose your app in the widget gallery, an Add button appears below the group of widgets you offer. You can specify a color for this button to help remind people of your brand.


### Platform considerations

No additional considerations for macOS. Not supported in tvOS.


#### iOS, iPadOS

Widgets on the Lock Screen are functionally similar to watch complications and follow design principles for  in addition to design principles for widgets. Provide useful information in your Lock Screen widget, and don’t treat it only as an additional way for people to launch into your app. In many cases, a design for complications also works well for widgets on the Lock Screen (and vice versa), so consider creating them in tandem.

Your app can offer widgets on the Lock Screen in three different shapes: as inline text that appears above the clock, and as circular and rectangular shapes that appear below the clock.

Support the Always-On display on iPhone. Devices with the Always-On display render widgets on the Lock Screen with reduced luminance. Use levels of gray that provide enough contrast in the Always-On display, and make sure your content remains legible.

For developer guidance, see .

Offer Live Activities to show real-time updates. Widgets don’t show real-time information. If your app allows people to track the progress of a task or event for a limited amount of time with frequent updates, consider offering Live Activities. Widgets and Live Activities use the same underlying frameworks and share design similarities. As a result, it can be a good idea to develop widgets and Live Activities in tandem and reuse code and design components for both features. For design guidance on Live Activities, see ; for developer guidance, see .


##### StandBy and CarPlay

On iPhone in StandBy, the system displays two small system family widgets side-by-side, scaled up so they fill the Lock Screen. By supporting StandBy, you also ensure your widgets work well in CarPlay. CarPlay and StandBy widgets both use the small system family widget with the background removed and scaled up to best fit the grid on the Widgets screen. Glanceable information and large text are especially important in CarPlay to make your widget easy to read on a car’s display.

Limit usage of rich images or color to convey meaning in StandBy. Instead, make use of the additional space by scaling up and rearranging text so people can glance at the widget content from a greater distance. To seamlessly blend with the black background, don’t use background colors for your widget when it appears in StandBy.

For developer guidance, see .

On iPhone in StandBy in low-light conditions, the system renders widgets in a monochromatic look with a red tint.


#### visionOS

Widgets in visionOS are 3D objects that people place on a horizontal or vertical surface. When a person places a widget on a surface, the widget persists in that location even when the person turns Apple Vision Pro off and back on. Widgets have a consistent, real-world scale. Their size, mounting style, and treatment style impact how a person perceives them.

visionOS widgets appear in full-color by default, but they appear in the accented rendering mode when people personalize them with tint colors using a range of system-provided color palettes. Additionally, people can customize the frame width of widgets that use the elevated mounting style, and custom options that are unique to the widget. For example, visionOS doesn’t provide systemwide light or dark appearances. However, the Music poster widget offers its own customization option that lets people choose between a light and a dark theme that the app generates from the displayed album art.

For developer guidance, see .

Adapt your design and content for the spatial experience Apple Vision Pro provides. In visionOS, widgets don’t float in isolation but are part of living rooms, kitchens, offices, and more. Consider this context early and think of widgets as part of someone’s surroundings when you bring your existing widgets to visionOS or design them from scratch. For example, the Music widget adapts to a poster-like appearance that’s glanceable across the room with large typography and a high-resolution image, and a productivity app might offer a small widget that easily fits on a desk.

Test your widgets across the full range of system color palettes and in different lighting conditions. Make sure your widget’s tone, contrast, and legibility remain consistent and intentional. If you choose to exclude UI elements from tinting, test your widget in every provided tint color palette to make sure the untinted elements remain legible when a person customizes their widgets with tint colors.


##### Thresholds and sizes

Widgets on Apple Vision Pro can adapt based on a person’s proximity, and visionOS provides widgets with two key thresholds to design for: the  threshold for when a person views a widget at a distance, and the  threshold when a person views it nearby.

Because widgets can appear throughout a person’s environment, it’s also important to match a widget’s size to the type of content it contains, and to be aware of how it appears at a variety of distances.

Design a responsive layout that shows the right level of detail for each of the two thresholds. When a person views the widget at a distance, display a simplified version of your widget that shows fewer details and has a larger type size, and remove interactive elements like buttons or toggles. When a person views the widget from nearby, show more details and use a smaller type size. To create a smooth and consistent experience and help your layout feel continuous, maintain shared elements across both distance thresholds.

Offer widget family sizes that fit a person’s surroundings well. Widgets map to real-world dimensions and have a permanent presence in a person’s spatial environment. Think about where people might place your widget — mounted to a wall, placed on a sideboard, or sitting next to a workplace — and choose a widget family size that’s right for that context. For example, offer a small system widget with content that people might place on a desk or an extra large widget to let people decorate their surroundings with something visually rich, like artwork or photography.

Display content in a way that remains legible from a range of distances. To make a widget feel intentional and proportionate to where they place it, people can scale a widget from 75 to 125 percent in size. Use print design principles like clear hierarchy, strong typography, and scale to make sure your content remains glanceable. Include high-resolution assets that look good scaled up to every size.


##### Mounting styles

The way a widget appears on a surface plays a big role in how a person perceives it. To make it feel intentional and integrated into their surroundings, people place a widget on surfaces in distinct mounting styles.

-  style.  On horizontal surfaces — for example, on a desk — the widget always appears elevated and gently tilts backward, providing a subtle angle that improves readability, and casts a soft shadow that helps it feel grounded on the surface. On vertical surfaces — for example, on a wall — the widget either appears elevated, sitting flush on the surface and similar to how you mount a picture frame.

-  style. On vertical surfaces — for example, on a wall — the widget can appear recessed, with content set back into the surface, creating a depth effect that gives the illusion of a cutout in the surface. Horizontal surfaces don’t use the recessed mounting style.

By default, widgets use the elevated mounting style, because it works for horizontal and vertical surfaces.

Choose the mounting style that fits your content and the experience you want to create. By default, visionOS widgets use the elevated mounting style, which is ideal for content that you want to stand out and feel present, like reminders, media, or glanceable data. Recessed widgets are ideal for immersive or ambient content, like weather or editorial content, and people can only place them on a vertical surface. If a style doesn’t suit your widget, you can opt out of it for each widget. If you choose to only support the recessed mounting style, people can’t place the widget on a horizontal surface. For example, a weather app might only support the recessed mounting style to give the illusion of looking out of a window for its large and extra-large system family widgets, and only support the elevated style for its small system family widget.

> [NOTE] Use the  property of your  to  declare supported mounting styles — elevated, recessed, or both — for all widgets included in the configuration. To offer a widget that only supports one mounting style and other widgets that support both mounting styles, create separate widget configurations. For example, create one widget configuration for the widget that only supports the recessed mounting style, and a second configuration for the widgets that support both mounting styles.

Test your elevated widget designs with each system-provided frame width. People can choose from different system-defined frame widths for widgets that use the elevated mounting style. You can’t change your layout based on the frame width a person chooses, so make sure your widget layout stays visually balanced for each frame width.


##### Treatment styles

In addition to size and mounting style, the system applies one of two treatment styles to visionOS widgets. Choosing the right treatment for your widget helps reinforce the experience you want to create.

- The  style creates a more grounded, print-like style that feels solid and makes the widget feel like part of its surroundings. When lighting conditions change, widgets in the paper style become darker or lighter in response.

- The  style creates a lighter, layered look that adds depth and visual separation between foreground and background elements to emphasize clarity and contrast. The foreground elements always stay bright and legible, and don’t dim or brighten, even as ambient light changes.

Choose the paper style for a print-like look that feels more like a real object in the room. The entire widget responds to the ambient lighting and blends naturally into its surroundings. For example, the Music poster widget uses the paper style to display albums and playlists like framed artwork on a wall.

Choose the glass style for information-rich widgets. Glass visually separates foreground and background elements, allowing you to decide which parts of your interface adapt to the surroundings and which stay visually consistent. Foreground elements appear in full color, unaffected by ambient lighting, to make sure important content stays sharp and legible. For example, a News widget appears with editorial images in the background with a soft, print-like look. Its headlines stay in the foreground, crisp and easy to read.


#### watchOS

Provide a colorful background that conveys meaning. By default, widgets in the Smart Stack use a black background. Consider using a custom background color that provides additional meaning. For example, the Stocks app uses a red background for falling stock values and a green background if a stock’s value rises.

Encourage the system to display or elevate the position of your watchOS widget in the Smart Stack. Relevancy information helps the system show your widget when people need it most. Relevance can be location-based or specific to ongoing system actions, like a workout. For developer guidance, see .


### Specifications

As you design your widgets, use the following values for guidance.


#### iOS dimensions


#### iPadOS dimensions


#### visionOS dimensions


#### watchOS dimensions


### Resources


##### Related


##### Developer documentation

 — WidgetKit


##### Videos


### Change log
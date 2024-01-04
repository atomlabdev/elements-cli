import prompts from "prompts";

export const promptIsExpo = async () => {
  const response = await prompts({
    type: "confirm",
    name: "expo",
    message: "We've detected that this is an Expo project - is that correct?",
    initial: true,
  });

  if (response && response.expo) {
    return true;
  } else {
    return false;
  }
};

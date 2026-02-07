class Rule:
    def __init__(self, name: str, invert: bool = False, thresholds: dict[str, int] = None, weights: dict[str, int] = None):
        self.__name = name
        self.__score = 0
        self.__thresholds = thresholds if thresholds is not None else {}    # {'medium': value, 'high': value, 'very_high': value}
        self.__weights = weights if weights is not None else {}             # {'medium': w1, 'high': w2, 'very_high': w3}
        self.__invert = invert                                              # invert > to < (for evaluation)
        self.__tier = None

    def add_rule(self, thresholds: dict[str, int], weights: dict[str, int]) -> None:
        self.__thresholds = thresholds
        self.__weights = weights


    def evaluate(self, value: int|float) -> tuple[int, str|None]:
        self.__score = 0
        self.__tier = None

        for tier in ('very_high', 'high', 'medium'):
            if tier in self.__thresholds:
                if (not self.__invert and value >= self.__thresholds[tier]) or (self.__invert and value <= self.__thresholds[tier]):
                    self.__score = self.__weights[tier]
                    self.__tier = tier
                    break

        return self.__score, self.__tier

    def get_score(self) -> int:
        return self.__score

    def get_tier(self) -> str | None:
        return self.__tier

    def get_name(self) -> str:
        return self.__name

    def get_max_weight(self):
        return max(self.__weights.values())

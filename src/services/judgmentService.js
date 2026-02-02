const COMMENT_BANK = {
  bull_v1: [
    '突破就是续涨，别眨眼。',
    '多头主导，回踩只是蓄力。',
    '趋势在上，空头还在梦里。',
    '主升浪开场，后面更凶。',
  ],
  bear_v1: [
    '反弹是诱多，向下更干脆。',
    '空头结构没破，继续下。',
    '上拉只是分发，别被骗。',
    '高位发抖，接下来下砸。',
  ],
  chaos_v1: [
    '今天没逻辑，感觉就这样。',
    '动能乱跳，先看平。',
    '心里没底，随便押一边。',
    '情绪先行，走势靠后。',
  ],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createJudgmentService() {
  function generateJudgment(agent, context) {
    let direction = 'UP';
    let confidence = 80;

    if (agent.id === 'bull_v1') {
      direction = 'UP';
      confidence = randomInt(82, 98);
    } else if (agent.id === 'bear_v1') {
      direction = 'DOWN';
      confidence = randomInt(78, 96);
    } else {
      const choices = ['UP', 'DOWN', 'FLAT'];
      direction = pick(choices);
      confidence = randomInt(45, 82);
    }

    const commentBase = pick(COMMENT_BANK[agent.id] || COMMENT_BANK.chaos_v1);
    const deltaNote =
      Math.abs(context.deltaPct) >= 0.2
        ? ` 这波${context.deltaPct > 0 ? '红' : '绿'}让人上头。`
        : '';
    const comment = `${commentBase}${deltaNote}`.slice(0, 140);

    return {
      direction,
      confidence,
      comment,
    };
  }

  return {
    generateJudgment,
  };
}

module.exports = {
  createJudgmentService,
};

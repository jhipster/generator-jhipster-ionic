module.exports = (Base) =>
  class IonicBase extends Base {
    constructor(args, opts) {
      if (!opts.help && !opts.env.sharedOptions.configOptions) {
        opts.configOptions = opts.configOptions || {};
        opts.env.sharedOptions.configOptions = opts.configOptions;
      }
      opts.fromCli = true;
      super(args, opts);
    }
  };

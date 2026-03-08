# A Roadmap for ML Systems & Data Science

This document collects resources I have found genuinely useful over my career as an ML engineer. It is not exhaustive and it is highly opinionated, so please take it with a grain of salt. To be blunt straight out of the gate, I am not a big fan of corporate certificates or generalised courses. I think they are fundamentally limited by their aspiration to be generalisable and your time could be better utilised building actual projects. That being said, do not worry if you have already done them, if you learnt something from them that is awesome, that was just _my_ opinion on them. The resources below are ones I think will actually move the needle if you engage with them seriously.

This field is quite deep, do not be afraid of mistakes or being wrong, that is the first step to learning something. If you are not looking back at your work from 6 to 12 months ago and thinking "wow, I would have done X differently now that I know of Y, i'll do that moving forward" then you are probably not growing or challenging yourself enough.

---

## 1. How Careers Actually Progress

The titles vary by company, but the responsibilities roughly follow this pattern. Do not stress if you spend a long time in junior or intermediate roles. It depends entirely on company structure and what projects come your way.

- **Junior:** Focus on improving yourself. You will do a lot of the grunt work, getting code reviews from those with more experience. This teaches humility and is necessary.

- **Intermediate:** Focus on improving the team. Task planning, delegating, suggesting alternative technologies, reviewing others' work, and eventually leading projects and coordinating across teams.

- **Senior:** Focus on improving the department or company. You code less and spend more time in planning meetings, presenting outcomes, and introducing frameworks. The consequences of team decisions fall on you, so code review and technical guidance become critical.

Soft skills become dramatically more important the further up you go. You can be a brilliant developer, but if you are difficult to work with, promotions will pass you by. Humans are uncannily good at working in groups, so leverage that.

---

## 2. Foundational ML & Data Science

### Books (History & Intuition)

- [Algorithms to Live By](https://www.goodreads.com/book/show/25666050-algorithms-to-live-by)
  _Great for building intuition about algorithmic thinking in everyday decisions._

- [The Alignment Problem](https://www.goodreads.com/book/show/50489349-the-alignment-problem)
  _Excellent primer on the challenges of building ML systems that do what we actually want._

### Textbooks & References

- [Foundations of Machine Learning (Mohri et al.)](https://cs.nyu.edu/~mohri/mlbook/)
  _Rigorous mathematical foundations. Good if you want depth beyond the typical course._

- [Data Driven Science and Engineering (Brunton & Kutz)](https://databookuw.com/)
  _Bridges ML with physics and engineering. Strong on dynamical systems and SVD._

### Collections & References

- [Stephan Osterburg's ML Scrapbook](https://stephanosterburg.gitbook.io/scrapbook)
  _Unorganized but wide-ranging collection of ML notes and references._

- [Google PAIR Explorables](https://pair.withgoogle.com/explorables/)
  _Interactive mini case studies on interpretability, fairness, and model behavior. Worth browsing for real-world examples rather than theory._

---

## 3. Production ML & MLOps

This is where most people hit a wall. Prototyping a model in a notebook is a mere fraction of the actual work. The rest is everything around it: shoring up the data pipelines, productionising your prototype, shimmying the cleaned up model into a live codebase, monitoring it when it inevitably drifts, and convincing your team the pipeline is not held together with duct tape. I spent years learning this the hard way, but these resources will get you there faster and hopefully save you some of the trial and error I did.

### Essential Reading

- [The Pragmatic Programmer for Machine Learning](https://ppml.dev/index.html)
  _Practical engineering mindset applied to ML. Short, actionable, and well-structured._

- [Three Levels of ML Software (ml-ops.org)](https://ml-ops.org/content/three-levels-of-ml-software)
  _Clear framework for understanding the layers of an ML system beyond the model._

- [Hidden Technical Debt in ML Systems (Sculley et al., 2015)](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems)
  _The foundational paper on why ML systems accumulate maintenance costs. Read this early._

- [Rules of Machine Learning (Martin Zinkevich, Google)](https://developers.google.com/machine-learning/guides/rules-of-ml)
  _43 practical rules from Google's experience. Especially strong on when NOT to use ML._

- [Google MLOps: Continuous Delivery and Automation Pipelines](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)
  _Defines three maturity levels (0-2) for ML operations. Good for understanding where your team sits._

### Further Reading

- [Chip Huyen's MLOps Guide](https://huyenchip.com/mlops/)
  _For a more comprehensive collection of MLOps resources, case studies, and tooling overviews, this covers similar ground to this guide with significantly more depth. If you only bookmark one link from this document, make it this one._

---

## 4. Practical Tooling Advice

Pick up Docker early. I cannot stress this enough. Getting comfortable with containerization and deploying code will pay dividends throughout your career and save you from a lot of painful conversations with DevOps. Also, go talk to people. I spent a considerable amount of time talking with Data Engineers and Software Engineers just to understand how my work fit into the bigger picture, and it was some of the most valuable learning I did. That convoluted expensive feature that adds +0.01% to your target metric probably won't see the light of day if the SWE or MLE thinks it will tank their P99 response times.

- **Web Apps:** Plotly Dash or Streamlit for internal tools. They are quick and will get something in people's hands right away. Full React stack if you need proper authentication across the company. In this space I am talking about demos or other toys where you are trying to get buy-in from others. I have even done dedicated SHAP-based tools to really encourage understanding with less technical team members.

- **Dashboarding:** Grafana and Prometheus stack all the way. SWE and DevOps will thank you for using something they already understand. The stratification potential and flexibility of the alerting is a great asset. This is primarily for operational and model performance monitoring rather than stakeholder-facing business analytics. I am personally not a fan of Tableau or Power BI for people who can code, but if that is what your company uses, unfortunately you have to commit to it.

- **APIs:** If staying in Python, FastAPI is excellent for serving models. Build a proper API layer early so your model communication is well defined. If you are serving into a different language stack, look into language-agnostic tooling like ONNX for portable model inference.

- **Experiment Tracking:** MLflow is excellent and works great on Kubernetes (with a Postgres backing instance). Weights & Biases is a more polished experience but is not free.

---

## 5. Cheesy Advice That Needs Saying

- Say yes to opportunities, especially uncomfortable ones.
- Focus on improving yourself above everything else.
- Try to work well with others. Everyone can teach you something, even if it is just what not to do.
- Talk to people outside your discipline. Some of the best things I learned came from conversations with data engineers and software engineers, not from courses.
- Build things and run into brick walls. Then you have specific things to search for out of frustration. That feedback loop is worth more than any structured curriculum.
